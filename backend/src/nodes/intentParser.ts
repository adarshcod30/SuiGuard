import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { IntentEngineState, StructuredIntent } from '../types.js';

const IntentSchema = z.object({
  action: z.enum(['transfer', 'swap', 'stake', 'query_balance', 'unknown']),
  amount: z.number().describe('Amount in the primary token (e.g. 0.5 for 0.5 SUI). Use 0 for queries.'),
  token_in: z.string().describe('Source token symbol, e.g. SUI, USDC. Default to SUI if unclear.'),
  token_out: z.string().optional().describe('Target token symbol for swaps.'),
  recipient: z.string().optional().describe('Recipient Sui address for transfers. Null if not transfer.'),
  protocol: z.string().optional().describe('Named protocol if user specifies one, e.g. Cetus, Turbos.'),
  constraints: z.array(z.string()).optional().describe('Any user-specified constraints like max slippage.'),
}).describe('Parsed intent from user natural language input.');

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
}).withStructuredOutput(IntentSchema);

export async function parseIntentNode(
  state: IntentEngineState
): Promise<Partial<IntentEngineState>> {
  console.log('🔍 [Node 1] Parsing intent:', state.userInput);

  try {
    const result = await llm.invoke([
      {
        role: 'system',
        content: `You are a DeFi intent parser for the Sui blockchain. 
Parse the user's natural language financial goal into a structured intent.
Sui uses SUI as its native token. Common tokens: SUI, USDC, USDT, WETH.
If the user says "send", "give", or "pay", that's a transfer action.
If the user says "swap", "exchange", "convert", "trade", that's a swap.
If the user gives a recipient address (starts with 0x and is 66 chars), set it as recipient.
If no amount is specified for a query, use 0.
Always extract a specific numeric amount — never leave it as 0 unless it's a balance query.`
      },
      { role: 'user', content: state.userInput }
    ]);

    const intent = result as StructuredIntent;
    intent.raw_input = state.userInput;

    console.log('✅ [Node 1] Intent parsed:', JSON.stringify(intent, null, 2));

    return {
      intent,
      stage: 'compiling',
    };
  } catch (e) {
    console.error('❌ [Node 1] Parse failed:', e);
    return {
      error: `Could not understand your intent. Please try: "Send 0.5 SUI to 0x..." or "Swap 10 USDC for SUI"`,
      stage: 'error',
    };
  }
}
