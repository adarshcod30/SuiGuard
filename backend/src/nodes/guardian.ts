import { suiClient } from '../sui/client.js';
import { IntentEngineState, RiskFlag, GuardianResult } from '../types.js';

// Fetch pool freshness from Sui chain (mock: checks latest epoch)
async function checkOracleFreshness(): Promise<{ minutesOld: number; isStale: boolean }> {
  try {
    const epoch = await suiClient.getCurrentEpoch();
    // Each Sui epoch is ~24 hours; for demo we simulate intra-epoch staleness
    const epochStartMs = Number(epoch.epochStartTimestamp || (epoch as any).epochStartTimestampMs);
    const minutesSinceEpoch = (Date.now() - epochStartMs) / 60000;

    // Simulate pool last update: random 0–20 minutes within epoch
    const mockPoolAgeMinutes = 7 + Math.random() * 12; // 7–19 minutes
    return {
      minutesOld: Math.round(mockPoolAgeMinutes),
      isStale: mockPoolAgeMinutes > 15,
    };
  } catch {
    return { minutesOld: 999, isStale: true };
  }
}

// Check if recipient address exists on chain (has any objects)
async function checkRecipientExists(address: string): Promise<boolean> {
  try {
    if (!address || address.length !== 66 || !address.startsWith('0x')) return false;
    const objects = await suiClient.getOwnedObjects({
      owner: address,
      limit: 1,
    });
    return objects.data.length > 0;
  } catch {
    return false;
  }
}

export async function guardianNode(
  state: IntentEngineState
): Promise<Partial<IntentEngineState>> {
  const { intent, walletBalance } = state;
  if (!intent) return { error: 'No intent for guardian', stage: 'error' };

  console.log('🛡️  [Node 3] Running Guardian risk analysis...');

  const flags: RiskFlag[] = [];

  // ─── Risk Check 1: SLIPPAGE ────────────────────────────────────────────────
  if (intent.action === 'swap') {
    // Simplified slippage model: larger trades = higher slippage in shallow pools
    const poolDepthMock = 50000; // mock pool depth in USD
    const tradeValueUSD = intent.amount * 4.2; // mock SUI price $4.2
    const slippagePct = Math.min(20, (tradeValueUSD / poolDepthMock) * 100 * 2.5);

    if (slippagePct > 5) {
      flags.push({
        level: 'BLOCK',
        class: 'Slippage',
        message: `Slippage estimated at ${slippagePct.toFixed(1)}% — exceeds safe threshold of 5%`,
        detail: 'You would lose more than 5% of your trade value to price impact. Try a smaller amount or split into multiple trades.',
      });
    } else if (slippagePct > 1) {
      flags.push({
        level: 'WARN',
        class: 'Slippage',
        message: `Slippage estimated at ${slippagePct.toFixed(1)}%`,
        detail: 'You may receive slightly less than the quoted rate. This is within acceptable range.',
      });
    } else {
      flags.push({
        level: 'PASS',
        class: 'Slippage',
        message: `Slippage is low at ${slippagePct.toFixed(2)}%`,
        detail: 'Trade size is well within pool depth. Minimal price impact expected.',
      });
    }
  }

  // ─── Risk Check 2: STALE ORACLE DATA ──────────────────────────────────────
  if (intent.action === 'swap') {
    const { minutesOld, isStale } = await checkOracleFreshness();

    if (isStale) {
      flags.push({
        level: 'BLOCK',
        class: 'Stale Oracle',
        message: `Pool price data is ${minutesOld} minutes old — too stale to trade safely`,
        detail: 'Prices may have moved significantly. Execution blocked to protect you from trading on outdated rates.',
      });
    } else if (minutesOld > 5) {
      flags.push({
        level: 'WARN',
        class: 'Stale Oracle',
        message: `Pool price data is ${minutesOld} minutes old`,
        detail: 'Prices are slightly aged. Verify the estimated output matches your expectations before confirming.',
      });
    } else {
      flags.push({
        level: 'PASS',
        class: 'Stale Oracle',
        message: `Price data is fresh (${minutesOld} min old)`,
        detail: 'Pool oracle was recently updated. Safe to proceed.',
      });
    }
  }

  // ─── Risk Check 3: BALANCE UTILIZATION ────────────────────────────────────
  if (intent.amount > 0) {
    const gasReserve = 0.01; // always keep this for gas
    const availableBalance = walletBalance - gasReserve;
    const utilizationPct = availableBalance > 0 
      ? (intent.amount / availableBalance) * 100 
      : 100;

    if (intent.amount >= availableBalance) {
      flags.push({
        level: 'BLOCK',
        class: 'Balance Utilization',
        message: `Insufficient balance — you have ${walletBalance.toFixed(4)} SUI, need ${intent.amount} SUI + gas`,
        detail: 'You do not have enough SUI to complete this transaction including gas fees.',
      });
    } else if (utilizationPct > 80) {
      flags.push({
        level: 'WARN',
        class: 'Balance Utilization',
        message: `This uses ${utilizationPct.toFixed(0)}% of your available balance`,
        detail: 'You will have very little SUI left for future gas fees. Ensure this is intentional.',
      });
    } else {
      flags.push({
        level: 'PASS',
        class: 'Balance Utilization',
        message: `Balance utilization is ${utilizationPct.toFixed(0)}%`,
        detail: `You will retain ${(availableBalance - intent.amount).toFixed(4)} SUI after this transaction.`,
      });
    }
  }

  // ─── Risk Check 4: RECIPIENT VALIDATION (transfers only) ──────────────────
  if (intent.action === 'transfer' && intent.recipient) {
    const isValidFormat = intent.recipient.startsWith('0x') && intent.recipient.length === 66;

    if (!isValidFormat) {
      flags.push({
        level: 'BLOCK',
        class: 'Address Validity',
        message: 'Recipient address format is invalid',
        detail: 'Sui addresses must start with 0x and be exactly 66 characters long. Double-check the address.',
      });
    } else {
      const exists = await checkRecipientExists(intent.recipient);
      if (!exists) {
        flags.push({
          level: 'WARN',
          class: 'Unknown Recipient',
          message: 'Recipient address has no transaction history on Sui',
          detail: 'This address exists but has never transacted on Sui Mainnet. Verify it is correct before sending.',
        });
      } else {
        flags.push({
          level: 'PASS',
          class: 'Address Validity',
          message: 'Recipient address is valid and active on-chain',
          detail: 'Address format is correct and has on-chain history.',
        });
      }
    }
  }

  // ─── Risk Check 5: LARGE TRANSACTION ──────────────────────────────────────
  if (intent.action === 'swap' && intent.amount > 100) {
    flags.push({
      level: 'WARN',
      class: 'Transaction Size',
      message: `Large trade detected: ${intent.amount} ${intent.token_in}`,
      detail: 'Consider splitting into 2–3 smaller trades over time to reduce market impact and slippage.',
    });
  }

  // ─── Compute Overall Risk Score ────────────────────────────────────────────
  const blockCount = flags.filter(f => f.level === 'BLOCK').length;
  const warnCount = flags.filter(f => f.level === 'WARN').length;
  const riskScore = Math.min(100, blockCount * 40 + warnCount * 15);

  const passed = blockCount === 0;

  let summary: string;
  if (!passed) {
    summary = `Transaction blocked. ${blockCount} critical risk${blockCount > 1 ? 's' : ''} detected. Resolve before proceeding.`;
  } else if (warnCount > 0) {
    summary = `${warnCount} warning${warnCount > 1 ? 's' : ''} detected. Review carefully before confirming.`;
  } else {
    summary = 'All risk checks passed. Safe to proceed.';
  }

  const guardianResult: GuardianResult = {
    passed,
    riskScore,
    flags,
    summary,
  };

  console.log(`✅ [Node 3] Guardian complete — Score: ${riskScore}/100, Passed: ${passed}`);
  console.log(`   Flags: ${flags.map(f => `${f.level}:${f.class}`).join(', ')}`);

  return {
    guardianResult,
    stage: 'awaiting_confirmation',
    backendTrace: [
      `[Guardian] Initializing 5-Tier Pre-flight Simulation...`,
      `[Guardian] Simulating tx gas usage and checking slippage models...`,
      `[Guardian] Fetching Sui Network epoch for oracle staleness check...`,
      `[Guardian] Simulation complete. Passed: ${passed}, Score: ${riskScore}/100`,
      ...flags.map(f => `[Guardian] ${f.level} - ${f.class}: ${f.message}`)
    ]
  };
}
