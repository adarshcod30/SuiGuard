import { StateGraph, END, START } from '@langchain/langgraph';
import { IntentEngineState } from './types.js';
import { parseIntentNode } from './nodes/intentParser.js';
import { compilePTBNode } from './nodes/ptbCompiler.js';
import { guardianNode } from './nodes/guardian.js';
import { executorNode } from './nodes/executor.js';

// Channel definitions for LangGraph state
const channels = {
  userInput: { value: (x: string) => x, default: () => '' },
  sessionId: { value: (x: string) => x, default: () => '' },
  walletAddress: { value: (x: string) => x, default: () => '' },
  walletBalance: { value: (x: number) => x, default: () => 0 },
  intent: { value: (x: any) => x, default: () => undefined },
  ptbPreview: { value: (x: any) => x, default: () => undefined },
  ptbObject: { value: (x: any) => x, default: () => undefined },
  guardianResult: { value: (x: any) => x, default: () => undefined },
  userConfirmed: { value: (x: boolean | undefined) => x, default: () => undefined },
  txDigest: { value: (x: string | undefined) => x, default: () => undefined },
  explorerUrl: { value: (x: string | undefined) => x, default: () => undefined },
  langsmithRunUrl: { value: (x: string | undefined) => x, default: () => undefined },
  error: { value: (x: string | undefined) => x, default: () => undefined },
  stage: { value: (x: any) => x, default: () => 'parsing' },
};

function routeAfterGuardian(state: IntentEngineState): string {
  if (state.stage === 'error') return 'error_end';
  return 'await_confirmation';
}

function routeAfterParsing(state: IntentEngineState): string {
  if (state.stage === 'error') return 'error_end';
  return 'compile_ptb';
}

function routeAfterCompiling(state: IntentEngineState): string {
  if (state.stage === 'error') return 'error_end';
  return 'guardian';
}

// Phase 1: Parse intent → Compile PTB → Guardian check → Return to API
export async function runPhase1(input: {
  userInput: string;
  sessionId: string;
  walletAddress: string;
  walletBalance: number;
}): Promise<IntentEngineState> {
  const graph: any = new StateGraph<IntentEngineState>({ channels } as any);

  graph.addNode('parse_intent', parseIntentNode as any);
  graph.addNode('compile_ptb', compilePTBNode as any);
  graph.addNode('guardian', guardianNode as any);
  graph.addNode('error_end', async (s: IntentEngineState) => ({ ...s, stage: 'error' }));
  graph.addNode('done', async (s: IntentEngineState) => ({ ...s }));

  graph.addEdge(START, 'parse_intent');
  graph.addConditionalEdges('parse_intent', routeAfterParsing as any, {
    compile_ptb: 'compile_ptb',
    error_end: 'error_end',
  });
  graph.addConditionalEdges('compile_ptb', routeAfterCompiling as any, {
    guardian: 'guardian',
    error_end: 'error_end',
  });
  graph.addConditionalEdges('guardian', routeAfterGuardian as any, {
    await_confirmation: 'done',
    error_end: 'error_end',
  });
  graph.addEdge('done', END);
  graph.addEdge('error_end', END);

  const compiled = graph.compile();

  const result = await compiled.invoke({
    ...input,
    stage: 'parsing',
  } as IntentEngineState);

  return result as IntentEngineState;
}

// Phase 2: Execute after user confirmation
export async function runPhase2(state: IntentEngineState): Promise<IntentEngineState> {
  const graph: any = new StateGraph<IntentEngineState>({ channels } as any);

  graph.addNode('execute', executorNode as any);
  graph.addNode('error_end', async (s: IntentEngineState) => ({ ...s, stage: 'error' }));

  graph.addEdge(START, 'execute');
  graph.addEdge('execute', END);
  graph.addEdge('error_end', END);

  const compiled = graph.compile();
  const result = await compiled.invoke(state);
  return result as IntentEngineState;
}
