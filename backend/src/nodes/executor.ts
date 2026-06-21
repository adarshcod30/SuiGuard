import { suiClient } from '../sui/client.js';
import { keypair } from '../sui/wallet.js';
import { IntentEngineState } from '../types.js';

export async function executorNode(
  state: IntentEngineState
): Promise<Partial<IntentEngineState>> {
  const { ptbObject, intent, userConfirmed, guardianResult } = state;

  if (!userConfirmed) {
    console.log('⏭️  [Node 4] User cancelled — skipping execution');
    return { stage: 'done', txDigest: undefined };
  }

  if (!guardianResult?.passed) {
    return {
      error: 'Cannot execute — guardian checks not passed',
      stage: 'error',
    };
  }

  // Handle query_balance — no transaction needed
  if (intent?.action === 'query_balance') {
    return {
      stage: 'done',
      txDigest: 'NO_TX_BALANCE_QUERY',
      explorerUrl: `https://suiscan.xyz/testnet/account/${state.walletAddress}`,
    };
  }

  if (!ptbObject) {
    return { error: 'No PTB to execute', stage: 'error' };
  }

  console.log('⚡ [Node 4] Executing transaction on Sui testnet...');

  try {
    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: ptbObject,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    if (result.effects?.status?.status !== 'success') {
      const errMsg = result.effects?.status?.error || 'Transaction failed on-chain';
      console.error('❌ [Node 4] Transaction failed:', errMsg);
      return {
        error: `Transaction failed: ${errMsg}`,
        stage: 'error',
      };
    }

    const digest = result.digest;
    const explorerUrl = `https://suiscan.xyz/testnet/tx/${digest}`;

    console.log('✅ [Node 4] Transaction SUCCESS!');
    console.log('   Digest:', digest);
    console.log('   Explorer:', explorerUrl);

    return {
      txDigest: digest,
      explorerUrl,
      stage: 'done',
    };
  } catch (e: any) {
    console.error('❌ [Node 4] Execution error:', e.message);
    return {
      error: `Execution failed: ${e.message}`,
      stage: 'error',
    };
  }
}
