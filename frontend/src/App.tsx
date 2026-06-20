import React, { useState, useEffect } from 'react';
import IntentInput from './components/IntentInput';
import GuardianReview from './components/GuardianReview';
import SuccessScreen from './components/SuccessScreen';
import LoadingState from './components/LoadingState';

export type AppStage = 'input' | 'loading' | 'review' | 'executing' | 'success' | 'error';

export interface IntentResponse {
  sessionId: string;
  intent: any;
  ptbPreview: any;
  guardianResult: any;
  stage: string;
  error?: string;
  walletBalance: number;
  walletAddress: string;
  langsmithUrl: string;
}

export interface ExecuteResponse {
  status: string;
  txDigest?: string;
  explorerUrl?: string;
  error?: string;
  langsmithUrl: string;
}

const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const API = '';

export default function App() {
  const [stage, setStage] = useState<AppStage>('input');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [intentResponse, setIntentResponse] = useState<IntentResponse | null>(null);
  const [executeResponse, setExecuteResponse] = useState<ExecuteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState<{ address: string; balance: number } | null>(null);

  useEffect(() => {
    fetch(`${API}/api/wallet`)
      .then(r => r.json())
      .then(d => setWalletInfo({ address: d.address, balance: d.balance }))
      .catch(() => {});
  }, []);

  const handleSubmitIntent = async (input: string) => {
    setStage('loading');
    setLoadingMessage('Parsing your intent...');
    setError(null);

    try {
      setLoadingMessage('Compiling Programmable Transaction Block...');
      const res = await fetch(`${API}/api/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, sessionId: SESSION_ID }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      setLoadingMessage('Running Guardian risk analysis...');
      await new Promise(r => setTimeout(r, 600)); // brief pause for UX

      const data: IntentResponse = await res.json();

      if (data.error) {
        setError(data.error);
        setStage('error');
        return;
      }

      setIntentResponse(data);
      setStage('review');
    } catch (e: any) {
      setError(e.message || 'Failed to process intent');
      setStage('error');
    }
  };

  const handleConfirm = async (confirmed: boolean) => {
    if (!confirmed) {
      setStage('input');
      setIntentResponse(null);
      return;
    }

    setStage('executing');
    setLoadingMessage('Signing and submitting to Sui testnet...');

    try {
      const res = await fetch(`${API}/api/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: SESSION_ID, confirmed: true }),
      });

      const data: ExecuteResponse = await res.json();
      setExecuteResponse(data);

      if (data.status === 'success') {
        setStage('success');
      } else {
        setError(data.error || 'Transaction failed');
        setStage('error');
      }
    } catch (e: any) {
      setError(e.message || 'Execution failed');
      setStage('error');
    }
  };

  const handleReset = () => {
    setStage('input');
    setIntentResponse(null);
    setExecuteResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="border-b border-[#30363d] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6fbcf0]/20 border border-[#6fbcf0]/40 flex items-center justify-center">
              <span className="text-[#6fbcf0] text-sm font-bold">SG</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm">SuiGuard</h1>
              <p className="text-[#8b949e] text-xs">Intent Engine · Testnet</p>
            </div>
          </div>
          {walletInfo && (
            <div className="text-right">
              <p className="text-[#8b949e] text-xs font-mono">
                {walletInfo.address.slice(0, 8)}...{walletInfo.address.slice(-6)}
              </p>
              <p className="text-[#6fbcf0] text-xs font-mono font-medium">
                {walletInfo.balance.toFixed(4)} SUI
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {stage === 'input' && (
          <IntentInput onSubmit={handleSubmitIntent} />
        )}
        {(stage === 'loading' || stage === 'executing') && (
          <LoadingState message={loadingMessage} />
        )}
        {stage === 'review' && intentResponse && (
          <GuardianReview
            data={intentResponse}
            onConfirm={handleConfirm}
          />
        )}
        {stage === 'success' && executeResponse && (
          <SuccessScreen
            data={executeResponse}
            intent={intentResponse?.intent}
            onReset={handleReset}
          />
        )}
        {stage === 'error' && (
          <div className="text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-[#8b949e] mb-6 text-sm max-w-sm mx-auto">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-[#6fbcf0] text-[#0d1117] rounded-lg font-semibold text-sm hover:bg-[#6fbcf0]/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] px-6 py-4 mt-auto">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-[#8b949e]">
          <span>Built for Sui Overflow 2026 · Agentic Web Track</span>
          <span>Powered by LangGraph + Sui PTBs</span>
        </div>
      </footer>
    </div>
  );
}
