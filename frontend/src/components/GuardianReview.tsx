import React, { useState } from 'react';
import { IntentResponse } from '../App';

interface Props {
  data: IntentResponse;
  onConfirm: (confirmed: boolean) => void;
}

// ─── UTILS ──────────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: string }) {
  const config = {
    PASS: { bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-400', icon: '✓' },
    WARN: { bg: 'bg-yellow-500/10 border-yellow-500/30', text: 'text-yellow-400', icon: '⚠' },
    BLOCK: { bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-400', icon: '✕' },
  };
  const c = config[level as keyof typeof config] || config.WARN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.icon} {level}
    </span>
  );
}

// Simple Syntax Highlighter for JSON
function highlightJSON(json: any) {
  if (!json) return '';
  const str = JSON.stringify(json, null, 2);
  return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

// ─── BEGINNER MODE COMPONENTS ───────────────────────────────────────────────

function StoryCard({ data }: { data: IntentResponse }) {
  const { intent, ptbPreview } = data;
  
  if (intent?.action === 'query_balance') {
    return (
      <div className="glass-card rounded-2xl p-8 text-center border-blue-500/30 glow-blue">
        <h3 className="text-xl font-bold text-white mb-2">Check Balance</h3>
        <p className="text-[#8b949e] mb-4">We will read your current SUI balance.</p>
        <div className="text-3xl font-mono text-[#6fbcf0] font-bold">{ptbPreview?.estimatedOutput}</div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6fbcf0] opacity-10 blur-3xl rounded-full"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* You Give */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold mb-2">You Give</p>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20">
              S
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{intent?.amount}</p>
              <p className="text-sm text-[#6fbcf0] font-semibold">{intent?.token_in}</p>
            </div>
          </div>
        </div>

        {/* Animated Arrow */}
        <div className="hidden md:flex flex-col items-center justify-center px-4">
          <div className="text-[#30363d] text-2xl animate-pulse">→</div>
          <p className="text-[9px] text-[#4b5563] uppercase tracking-wider mt-1">{intent?.action}</p>
        </div>

        {/* You Get */}
        <div className="flex-1 text-center md:text-right">
          <p className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold mb-2">You Get (Est.)</p>
          <div className="flex items-center justify-center md:justify-end gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{ptbPreview?.estimatedOutput?.replace(/[^0-9.]/g, '') || '?'}</p>
              <p className="text-sm text-[#a78bfa] font-semibold">{intent?.token_out || intent?.recipient?.slice(0,6) || 'Tokens'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-purple-500/20">
              {intent?.token_out ? intent.token_out[0] : 'R'}
            </div>
          </div>
        </div>

      </div>

      {/* Simple Summary */}
      <div className="mt-6 pt-4 border-t border-[#30363d]/50 text-center">
        <p className="text-sm text-[#8b949e] leading-relaxed">
          <span className="text-white font-medium">What happens: </span> 
          We will take <span className="text-[#6fbcf0] font-mono">{intent?.amount} {intent?.token_in}</span> from your wallet and {intent?.action === 'swap' ? 'route it to get the best market price' : 'transfer it securely'}. 
          Gas cost is tiny (<span className="font-mono">{ptbPreview?.estimatedGas}</span>).
        </p>
      </div>
    </div>
  );
}

function SimplifiedRisk({ result }: { result: any }) {
  const passed = result?.passed;
  const isWarn = result?.riskScore > 0;
  
  const stateColor = !passed ? 'text-red-400' : isWarn ? 'text-yellow-400' : 'text-green-400';
  const stateBg = !passed ? 'bg-red-500/10 border-red-500/30' : isWarn ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30';

  return (
    <div className={`glass-card rounded-2xl p-6 border ${!passed ? 'glow-red border-red-500/40' : isWarn ? 'glow-yellow border-yellow-500/40' : 'glow-green border-green-500/40'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stateBg}`}>
            {!passed ? '🛡️' : isWarn ? '⚠️' : '✅'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Guardian Safety Check</h3>
            <p className={`text-sm font-semibold ${stateColor}`}>
              {!passed ? 'Transaction Blocked' : isWarn ? 'Proceed with Caution' : 'Safe to Execute'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {result?.flags.map((f: any, i: number) => (
          <div key={i} className="flex items-start gap-3 bg-[#0d1117]/60 p-3 rounded-xl border border-[#30363d]/30">
            <div className="mt-0.5">
              {f.level === 'BLOCK' ? '🔴' : f.level === 'WARN' ? '🟡' : '🟢'}
            </div>
            <div>
              <p className="text-sm text-white font-medium">{f.message}</p>
              <p className="text-xs text-[#8b949e] mt-1">{f.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EXPERT MODE COMPONENTS ────────────────────────────────────────────────

function RawPTBViewer({ ptbPreview }: { ptbPreview: any }) {
  const jsonStr = ptbPreview?.serialized ? highlightJSON(ptbPreview.serialized) : '<span class="text-gray-500">// No serialized PTB available</span>';
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden border-[#30363d]/50">
      <div className="flex items-center justify-between bg-[#0d1117] px-4 py-3 border-b border-[#30363d]/50">
        <div className="flex items-center gap-2">
          <span className="text-[#8b949e]">{"{}"}</span>
          <h3 className="text-sm font-semibold text-white font-mono">Serialized_TransactionBlock.json</h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[#6fbcf0] font-bold">Raw Payload</span>
      </div>
      <div className="p-4 overflow-x-auto bg-[#0a0e17] max-h-96">
        <pre 
          className="text-xs font-mono leading-relaxed"
          dangerouslySetInnerHTML={{ __html: jsonStr }}
        />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

export default function GuardianReview({ data, onConfirm }: Props) {
  const { intent, ptbPreview, guardianResult, walletBalance, walletAddress } = data;
  const [mode, setMode] = useState<'beginner' | 'expert'>('beginner');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* ─── HEADER & TOGGLE ─── */}
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🛡️ Guardian Review</h2>
        
        <div className="toggle-switch">
          <div className={`toggle-slider ${mode === 'expert' ? 'right' : ''}`}></div>
          <div 
            className={`toggle-option ${mode === 'beginner' ? 'active' : ''}`}
            onClick={() => setMode('beginner')}
          >
            Story Mode
          </div>
          <div 
            className={`toggle-option ${mode === 'expert' ? 'active' : ''}`}
            onClick={() => setMode('expert')}
          >
            Expert Mode
          </div>
        </div>
      </div>

      {/* ─── DUAL MODE VIEWS ─── */}
      <div className="transition-all duration-500 ease-in-out">
        {mode === 'beginner' ? (
          <div className="space-y-6 animate-fade-in-up">
            <StoryCard data={data} />
            <SimplifiedRisk result={guardianResult} />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Raw Intent */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5 min-w-0">
                <p className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold mb-3">Extracted Intent</p>
                <pre className="text-xs font-mono text-[#a78bfa] bg-[#0d1117] p-3 rounded-lg border border-[#30363d]/50 overflow-x-auto">
                  {JSON.stringify(intent, null, 2)}
                </pre>
              </div>
              <div className="glass-card rounded-2xl p-5 min-w-0">
                <p className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold mb-3">Execution Context</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-[#4b5563]">Sender</p>
                    <p className="text-xs text-[#6fbcf0] font-mono break-all">{walletAddress}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4b5563]">Gas Budget</p>
                    <p className="text-xs text-white font-mono">{ptbPreview?.estimatedGas}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4b5563]">Guardian Score</p>
                    <p className={`text-xs font-mono font-bold ${!guardianResult?.passed ? 'text-red-400' : 'text-green-400'}`}>
                      {guardianResult?.riskScore}/100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Raw PTB */}
            <RawPTBViewer ptbPreview={ptbPreview} />

            {/* Raw Flags */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold mb-3">Guardian Risk Matrix</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[#8b949e] border-b border-[#30363d]/50">
                    <tr>
                      <th className="pb-2 font-medium">Level</th>
                      <th className="pb-2 font-medium">Class</th>
                      <th className="pb-2 font-medium">Threshold Detail</th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    {guardianResult?.flags.map((f: any, i: number) => (
                      <tr key={i} className="border-b border-[#30363d]/20 last:border-0">
                        <td className="py-3 pr-4"><RiskBadge level={f.level} /></td>
                        <td className="py-3 pr-4 font-mono text-[#a78bfa]">{f.class}</td>
                        <td className="py-3 opacity-80 leading-relaxed">{f.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ─── WALLET & ACTIONS ─── */}
      <div className="pt-4 space-y-4">
        <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center text-xs">💰</div>
            <div>
              <p className="text-[9px] text-[#4b5563] uppercase tracking-widest font-semibold">Wallet Balance</p>
              <p className="text-white text-xs font-mono">{walletBalance.toFixed(4)} SUI</p>
            </div>
          </div>
          {data.langsmithUrl && (
            <a href={data.langsmithUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#6fbcf0] hover:text-white transition-colors flex items-center gap-1 bg-[#6fbcf0]/10 px-3 py-1.5 rounded-full border border-[#6fbcf0]/20">
              <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[#6fbcf0]"></span>
              Trace on LangSmith ↗
            </a>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(false)}
            className="flex-1 py-3.5 rounded-xl glass text-[#8b949e] hover:text-white hover:border-[#6fbcf0]/30 transition-all font-medium text-sm"
          >
            ← Cancel
          </button>
          {guardianResult?.passed ? (
            <button
              onClick={() => onConfirm(true)}
              className="btn-primary flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-[#6fbcf0] to-[#5ba3d9] text-[#0d1117] font-bold text-sm hover:shadow-lg hover:shadow-[#6fbcf0]/20 transition-all active:scale-[0.98]"
            >
              Sign & Execute Transaction
            </button>
          ) : (
            <button
              disabled
              className="flex-[2] py-3.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm cursor-not-allowed"
            >
              🚫 Blocked by Guardian
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
