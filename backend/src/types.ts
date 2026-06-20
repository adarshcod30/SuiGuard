export type IntentAction = 'transfer' | 'swap' | 'stake' | 'query_balance' | 'unknown';

export interface StructuredIntent {
  action: IntentAction;
  amount: number;
  token_in: string;
  token_out?: string;
  recipient?: string;
  protocol?: string;
  constraints?: string[];
  raw_input: string;
}

export type RiskLevel = 'PASS' | 'WARN' | 'BLOCK';

export interface RiskFlag {
  level: RiskLevel;
  class: 'Slippage' | 'Stale Oracle' | 'Balance Utilization' | 'Transaction Size' | 'Address Validity' | 'Unknown Recipient';
  message: string;
  detail: string;
}

export interface GuardianResult {
  passed: boolean;
  riskScore: number;
  flags: RiskFlag[];
  summary: string;
}

export interface PTBPreview {
  steps: string[];
  estimatedGas: string;
  estimatedOutput?: string;
  serialized?: any;
}

export interface IntentEngineState {
  userInput: string;
  sessionId: string;
  walletAddress: string;
  walletBalance: number;
  intent?: StructuredIntent;
  ptbPreview?: PTBPreview;
  ptbObject?: any; // Transaction object
  guardianResult?: GuardianResult;
  userConfirmed?: boolean;
  txDigest?: string;
  explorerUrl?: string;
  langsmithRunUrl?: string;
  error?: string;
  stage: 'parsing' | 'compiling' | 'guardian' | 'awaiting_confirmation' | 'executing' | 'done' | 'error';
}
