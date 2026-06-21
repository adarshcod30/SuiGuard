import { StateGraph, END, START } from '@langchain/langgraph';
import { IntentEngineState } from './types.js';
import { parseIntentNode } from './nodes/intentParser.js';
import { compilePTBNode } from './nodes/ptbCompiler.js';
import { guardianNode } from './nodes/guardian.js';
import { executorNode } from './nodes/executor.js';

// Channel definitions for LangGraph state
const lastValue = (oldVal: any, newVal: any) => newVal !== undefined ? newVal : oldVal;

const channels = {
  userInput: { value: lastValue, default: () => '' },
  sessionId: { value: lastValue, default: () => '' },
  walletAddress: { value: lastValue, default: () => '' },
  walletBalance: { value: lastValue, default: () => 0 },
  intent: { value: lastValue, default: () => undefined },
  ptbPreview: { value: lastValue, default: () => undefined },
  ptbObject: { value: lastValue, default: () => undefined },
  guardianResult: { value: lastValue, default: () => undefined },
  userConfirmed: { value: lastValue, default: () => undefined },
  txDigest: { value: lastValue, default: () => undefined },
  explorerUrl: { value: lastValue, default: () => undefined },
  langsmithRunUrl: { value: lastValue, default: () => undefined },
  error: { value: lastValue, default: () => undefined },
  stage: { value: lastValue, default: () => 'parsing' },
  backendTrace: { 
    value: (oldVal: string[], newVal: string[]) => [...(oldVal || []), ...(newVal || [])], 
    default: () => [] 
  },
};

// Wrapper: skip node if pipeline already errored
function skipOnError(nodeFn: (s: IntentEngineState) => Promise<Partial<IntentEngineState>>) {
  return async (state: IntentEngineState): Promise<Partial<IntentEngineState>> => {
    if (state.stage === 'error') return {}; // pass-through, don't run
    return nodeFn(state);
  };
}

// Phase 1: Parse intent → Compile PTB → Guardian check → Return to API
// Uses simple linear edges. Each node checks for errors via skipOnError wrapper.
export async function runPhase1(input: {
  userInput: string;
  sessionId: string;
  walletAddress: string;
  walletBalance: number;
}): Promise<IntentEngineState> {
  const graph: any = new StateGraph<IntentEngineState>({ channels } as any);

  graph.addNode('parse_intent', skipOnError(parseIntentNode) as any);
  graph.addNode('compile_ptb', skipOnError(compilePTBNode) as any);
  graph.addNode('guardian', skipOnError(guardianNode) as any);

  // Simple linear flow — no conditional edges, no unreachable nodes
  graph.addEdge(START, 'parse_intent');
  graph.addEdge('parse_intent', 'compile_ptb');
  graph.addEdge('compile_ptb', 'guardian');
  graph.addEdge('guardian', END);

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

  graph.addEdge(START, 'execute');
  graph.addEdge('execute', END);

  const compiled = graph.compile();
  const result = await compiled.invoke(state);
  return result as IntentEngineState;
}
