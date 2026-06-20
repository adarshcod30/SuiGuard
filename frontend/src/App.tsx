import React, { useState, useEffect } from 'react';
import IntentInput from './components/IntentInput';
import GuardianReview from './components/GuardianReview';
import SuccessScreen from './components/SuccessScreen';
import LoadingState from './components/LoadingState';
import LandingPage from './components/LandingPage';

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
  backendTrace?: string[];
}

export interface ExecuteResponse {
  status: string;
  txDigest?: string;
  explorerUrl?: string;
  error?: string;
  langsmithUrl?: string;
  backendTrace?: string[];
}

const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const API = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [stage, setStage] = useState<AppStage>('input');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [intentResponse, setIntentResponse] = useState<IntentResponse | null>(null);
  const [executeResponse, setExecuteResponse] = useState<ExecuteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState<{ address: string; balance: number } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/wallet`)
      .then(r => r.json())
      .then(d => {
        setWalletInfo({ address: d.address, balance: d.balance });
        setConnectionStatus('connected');
      })
      .catch(() => setConnectionStatus('error'));
  }, []);

  const handleSubmitIntent = async (input: string) => {
    setStage('loading');
    setLoadingMessage('Parsing your intent with Amazon Nova AI...');
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
      await new Promise(r => setTimeout(r, 600));

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
    setLoadingMessage('Signing and submitting to Sui mainnet...');

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

    if (showLanding) {
      return <LandingPage onLaunch={() => setShowLanding(false)} />;
    }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white bg-grid hero-gradient">
      {/* ─── Header ─── */}
      <header className="glass sticky top-0 z-50 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#6fbcf0] to-[#a78bfa] p-[1px]">
              <div className="w-full h-full rounded-xl bg-[#0d1117] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#6fbcf0]"></div>
              </div>
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm tracking-tight">SuiGuard</h1>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400 status-dot' :
                  connectionStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
                }`} />
                <p className="text-[#8b949e] text-[10px] font-medium">
                  {connectionStatus === 'connected' ? 'Mainnet Connected' :
                   connectionStatus === 'error' ? 'Backend Offline' : 'Connecting...'}
                </p>
              </div>
            </div>
          </div>
          {walletInfo && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[#8b949e] text-[10px] font-mono">
                  {walletInfo.address.slice(0, 6)}···{walletInfo.address.slice(-4)}
                </p>
                <p className="text-[#6fbcf0] text-xs font-mono font-semibold">
                  {walletInfo.balance.toFixed(4)} SUI
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#8b949e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="max-w-4xl mx-auto px-6 py-12">
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
          <div className="text-center animate-fade-in-up max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 glow-red">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Something went wrong</h2>
            <p className="text-[#8b949e] mb-8 text-sm leading-relaxed">{error}</p>
            <button
              onClick={handleReset}
              className="btn-primary px-8 py-3 bg-gradient-to-r from-[#6fbcf0] to-[#5ba3d9] text-[#0d1117] rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#6fbcf0]/20 transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#30363d]/50 px-6 py-5 mt-auto">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[10px] text-[#8b949e]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6fbcf0]"></span>
            <span>Built for Sui Overflow 2026 · Agentic Web Track</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by LangGraph + AWS Bedrock + Sui PTBs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
