import { ChatBedrockConverse } from '@langchain/aws';
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

// Amazon Nova models on Bedrock — no model access request needed
const MODELS = [
  'amazon.nova-lite-v1:0',
  'amazon.nova-micro-v1:0',
  'amazon.nova-pro-v1:0',
];

async function tryParseWithModel(modelName: string, userInput: string): Promise<StructuredIntent | null> {
  try {
    const llm = new ChatBedrockConverse({
      model: modelName,
      region: process.env.AWS_REGION || 'us-east-1',
      temperature: 0,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {}),
      },
    }).withStructuredOutput(IntentSchema);

    const result = await llm.invoke([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userInput },
    ]);

    return result as StructuredIntent;
  } catch (e: any) {
    const errMsg = e.message?.slice(0, 120) || 'Unknown error';
    console.warn(`⚠️  Model ${modelName} failed:`, errMsg);
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
        backendTrace: [
          `[System] Input received: "${state.userInput}"`,
          `[System] Invoking LLM Model: ${modelName} via AWS Bedrock...`,
          `[LLM] Successfully parsed unstructured input into JSON schema:`,
          JSON.stringify(intent, null, 2)
        ]
      };
    }
  }

  // All models failed
  console.error('❌ [Node 1] All models failed to parse intent');
  return {
    error: `Failed to parse intent. Please check your AWS credentials in .env (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION) and ensure Amazon Nova models are enabled in your Bedrock console.`,
    stage: 'error',
  };
}
