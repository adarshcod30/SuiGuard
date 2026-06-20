import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
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

const SYSTEM_PROMPT = `You are a DeFi intent parser for the Sui blockchain. 
Parse the user's natural language financial goal into a structured intent.
Sui uses SUI as its native token. Common tokens: SUI, USDC, USDT, WETH.
If the user says "send", "give", or "pay", that's a transfer action.
If the user says "swap", "exchange", "convert", "trade", that's a swap.
If the user gives a recipient address (starts with 0x and is 66 chars), set it as recipient.
If no amount is specified for a query, use 0.
If the user asks about their balance, wallet, or holdings, that's a query_balance action.
Always extract a specific numeric amount — never leave it as 0 unless it's a balance query.`;

// Models to try in order — gemini-2.0-flash-lite has higher free-tier quotas
const MODELS = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro-latest'];

async function tryParseWithModel(modelName: string, userInput: string): Promise<StructuredIntent | null> {
  try {
    const llm = new ChatGoogleGenerativeAI({
      model: modelName,
      temperature: 0,
      maxRetries: 2,
    }).withStructuredOutput(IntentSchema);

    const result = await llm.invoke([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userInput },
    ]);

    return result as StructuredIntent;
  } catch (e: any) {
    console.warn(`⚠️  Model ${modelName} failed:`, e.status || e.message?.slice(0, 100));
    return null;
  }
}

export async function parseIntentNode(
  state: IntentEngineState
): Promise<Partial<IntentEngineState>> {
  console.log('🔍 [Node 1] Parsing intent:', state.userInput);

  if (!state.userInput || state.userInput.trim() === '') {
    return {
      error: 'No input provided. Please describe what you want to do on Sui.',
      stage: 'error',
    };
  }

  // Try each model in order until one succeeds
  for (const modelName of MODELS) {
    console.log(`   Trying model: ${modelName}...`);
    const result = await tryParseWithModel(modelName, state.userInput);

    if (result) {
      const intent = result;
      intent.raw_input = state.userInput;

      console.log('✅ [Node 1] Intent parsed with', modelName, ':', JSON.stringify(intent, null, 2));

      return {
        intent,
        stage: 'compiling',
      };
    }
  }

  // All models failed
  console.error('❌ [Node 1] All models failed to parse intent');
  return {
    error: `Gemini API is temporarily rate-limited. Please wait 30 seconds and try again. If this persists, check your API key at https://aistudio.google.com/apikey`,
    stage: 'error',
  };
}
