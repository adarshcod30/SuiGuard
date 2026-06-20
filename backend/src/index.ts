import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { checkConnection } from './sui/client.js';
import { walletAddress, getBalance, fundWallet } from './sui/wallet.js';
import { runPhase1, runPhase2 } from './graph.js';
import { IntentEngineState } from './types.js';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory session store (keyed by sessionId)
const sessions = new Map<string, IntentEngineState>();

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  const connected = await checkConnection();
  const balance = await getBalance();
  res.json({
    status: 'ok',
    sui: connected ? 'connected' : 'disconnected',
    network: process.env.SUI_NETWORK || 'testnet',
    walletAddress,
    walletBalance: balance,
    langsmithProject: process.env.LANGCHAIN_PROJECT,
  });
});

// ─── Parse intent + run guardian ────────────────────────────────────────────
app.post('/api/intent', async (req, res) => {
  const { input, sessionId } = req.body as { input: string; sessionId: string };

  if (!input || !sessionId) {
    return res.status(400).json({ error: 'input and sessionId are required' });
  }

  try {
    const balance = await getBalance();

    // If balance is too low, try to fund
    if (balance < 0.01) {
      console.log('⚠️  Low balance, attempting faucet...');
      await fundWallet();
    }

    const freshBalance = await getBalance();

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📨 New intent: "${input}"`);
    console.log(`   Session: ${sessionId} | Balance: ${freshBalance.toFixed(4)} SUI`);

    const state = await runPhase1({
      userInput: input,
      sessionId,
      walletAddress,
      walletBalance: freshBalance,
    });

    // Store state for phase 2
    sessions.set(sessionId, state);

    // Build langsmith URL
    const langsmithUrl = `https://smith.langchain.com/projects/p/${process.env.LANGCHAIN_PROJECT}`;

    res.json({
      sessionId,
      intent: state.intent,
      ptbPreview: state.ptbPreview,
      guardianResult: state.guardianResult,
      stage: state.stage,
      error: state.error,
      walletBalance: freshBalance,
      walletAddress,
      langsmithUrl,
    });
  } catch (e: any) {
    console.error('API error:', e);
    res.status(500).json({ error: e.message || 'Internal server error' });
  }
});

// ─── Execute after user confirms ─────────────────────────────────────────────
app.post('/api/confirm', async (req, res) => {
  const { sessionId, confirmed } = req.body as { sessionId: string; confirmed: boolean };

  const state = sessions.get(sessionId);
  if (!state) {
    return res.status(404).json({ error: 'Session not found. Please re-submit your intent.' });
  }

  if (!confirmed) {
    sessions.delete(sessionId);
    return res.json({ status: 'cancelled', message: 'Transaction cancelled by user.' });
  }

  if (!state.guardianResult?.passed) {
    return res.status(400).json({ error: 'Cannot execute — guardian checks not passed.' });
  }

  try {
    const finalState = await runPhase2({ ...state, userConfirmed: true });
    sessions.delete(sessionId);

    const langsmithUrl = `https://smith.langchain.com/projects/p/${process.env.LANGCHAIN_PROJECT}`;

    res.json({
      status: finalState.stage === 'done' ? 'success' : 'error',
      txDigest: finalState.txDigest,
      explorerUrl: finalState.explorerUrl,
      error: finalState.error,
      langsmithUrl,
    });
  } catch (e: any) {
    console.error('Execution error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ─── Wallet info ─────────────────────────────────────────────────────────────
app.get('/api/wallet', async (req, res) => {
  const balance = await getBalance();
  res.json({ address: walletAddress, balance, network: process.env.SUI_NETWORK || 'testnet' });
});

// ─── Startup ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log('\n' + '═'.repeat(60));
  console.log('  🛡️  SuiGuard Intent Engine — Backend');
  console.log('═'.repeat(60));
  await checkConnection();
  const balance = await getBalance();
  console.log(`  Wallet: ${walletAddress}`);
  console.log(`  Balance: ${balance.toFixed(4)} SUI (${process.env.SUI_NETWORK || 'testnet'})`);
  console.log(`  LangSmith: ${process.env.LANGCHAIN_PROJECT}`);
  console.log(`  Server: http://localhost:${PORT}`);
  console.log('═'.repeat(60) + '\n');

  if (balance < 0.01) {
    console.log('⚠️  Low balance — requesting testnet SUI from faucet...');
    await fundWallet();
    const newBalance = await getBalance();
    console.log(`✅ Balance after faucet: ${newBalance.toFixed(4)} SUI`);
  }
});
