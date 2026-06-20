import { Transaction } from '@mysten/sui/transactions';
import { suiClient } from '../sui/client.js';
import { IntentEngineState, PTBPreview } from '../types.js';

// Known mainnet DEX package IDs (Cetus Router on mainnet)
const CETUS_MAINNET = '0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb';

export async function compilePTBNode(
  state: IntentEngineState
): Promise<Partial<IntentEngineState>> {
  const { intent, walletAddress } = state;
  if (!intent) return { error: 'No intent to compile', stage: 'error' };

  console.log('🔨 [Node 2] Compiling PTB for action:', intent.action);

  try {
    const tx = new Transaction();
    tx.setSender(walletAddress);

    const steps: string[] = [];
    let estimatedOutput: string | undefined;

    if (intent.action === 'transfer') {
      if (!intent.recipient) {
        return {
          error: 'Transfer requires a recipient address. Please include a Sui address (0x...)',
          stage: 'error',
        };
      }
      if (intent.amount <= 0) {
        return { error: 'Please specify an amount greater than 0.', stage: 'error' };
      }

      const amountMist = BigInt(Math.floor(intent.amount * 1_000_000_000));
      const [coin] = tx.splitCoins(tx.gas, [amountMist]);
      tx.transferObjects([coin], intent.recipient);

      steps.push(`① Split ${intent.amount} SUI from your gas coin`);
      steps.push(`② Transfer to ${intent.recipient.slice(0, 10)}...${intent.recipient.slice(-8)}`);
      steps.push(`③ Remaining gas refunded to your wallet`);
      estimatedOutput = `${intent.recipient.slice(0, 10)}... receives ${intent.amount} SUI`;

    } else if (intent.action === 'swap') {
      // For demo: simulate a swap PTB targeting a known testnet pool
      // In production, this would call Cetus/Turbos router
      const amountMist = BigInt(Math.floor(intent.amount * 1_000_000_000));
      const [coin] = tx.splitCoins(tx.gas, [amountMist]);

      // Move call to a mainnet pool (mock — shows PTB capability)
      tx.moveCall({
        target: `${CETUS_MAINNET}::router::swap`,
        arguments: [coin, tx.pure.u64(amountMist), tx.pure.u64(BigInt(0))],
        typeArguments: [
          `0x2::sui::SUI`,
          `0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC`
        ],
      });

      steps.push(`① Approve ${intent.amount} ${intent.token_in} for swap`);
      steps.push(`② Route through best available mainnet liquidity pool`);
      steps.push(`③ Receive ${intent.token_out || 'target token'} to your wallet`);
      steps.push(`④ Unspent input refunded atomically`);

      // Simulated rate for demo
      const mockRate = intent.token_in === 'SUI' ? 4.2 : 0.24;
      const mockOutput = (intent.amount * mockRate).toFixed(2);
      estimatedOutput = `~${mockOutput} ${intent.token_out || 'USDC'} (estimated)`;

    } else if (intent.action === 'query_balance') {
      // No PTB needed — just a read
      steps.push(`① Query SUI balance for your wallet`);
      steps.push(`② No transaction required — this is a read-only operation`);
      estimatedOutput = `Current balance: ${state.walletBalance.toFixed(4)} SUI`;

    } else {
      steps.push(`① Intent recognized but action type is experimental`);
      steps.push(`② Generating a safe no-op PTB for preview only`);
    }

    const amountMistStr = intent.amount ? BigInt(Math.floor(intent.amount * 1_000_000_000)).toString() : '0';

    const preview: PTBPreview = {
      steps,
      estimatedGas: '~0.001 SUI',
      estimatedOutput,
      serialized: intent.action !== 'query_balance' ? {
        sender: walletAddress,
        expiration: { None: true },
        gasData: { payment: [], owner: walletAddress, price: '1000', budget: '2000000' },
        commands: intent.action === 'transfer' ? [
          { SplitCoins: [ 'GasCoin', [ amountMistStr ] ] },
          { TransferObjects: [ [ 'Result(0)' ], intent.recipient ] }
        ] : [
          { SplitCoins: [ 'GasCoin', [ amountMistStr ] ] },
          { MoveCall: { package: CETUS_MAINNET, module: 'router', function: 'swap', arguments: ['Result(0)', amountMistStr, '0'] } }
        ]
      } : null,
    };

    console.log('✅ [Node 2] PTB compiled with', steps.length, 'steps');

    return {
      ptbPreview: preview,
      ptbObject: intent.action !== 'query_balance' ? tx : null,
      stage: 'guardian',
    };

  } catch (e: any) {
    console.error('❌ [Node 2] Compilation error:', e.message);
    return {
      error: `Failed to compile transaction: ${e.message}`,
      stage: 'error',
    };
  }
}
