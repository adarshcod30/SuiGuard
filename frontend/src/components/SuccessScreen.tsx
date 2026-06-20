import React from 'react';
import { ExecuteResponse } from '../App';
import BackendTerminal from './BackendTerminal';

interface Props {
  data: ExecuteResponse;
  intent: any;
  onReset: () => void;
}

export default function SuccessScreen({ data, intent, onReset }: Props) {
  const isBalanceQuery = data.txDigest === 'NO_TX_BALANCE_QUERY';

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
      {/* Success orb */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-green-500/15 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-3 rounded-full bg-green-500/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
        <div className="relative w-full h-full rounded-full glass border-green-500/30 flex items-center justify-center glow-green">
          <span className="text-4xl">✓</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-3">
        {isBalanceQuery ? 'Balance Retrieved' : 'Transaction Successful!'}
      </h2>
      <p className="text-[#8b949e] text-sm mb-10 max-w-sm mx-auto">
        {isBalanceQuery
          ? 'Your wallet balance has been queried successfully from the Sui testnet.'
          : 'Your transaction has been confirmed and is now visible on the Sui testnet blockchain.'
        }
      </p>

      {/* Transaction details */}
      {!isBalanceQuery && data.txDigest && (
        <div className="glass-card rounded-2xl p-5 glow-green mb-8 text-left">
          <div className="space-y-4">
            <div>
              <p className="text-[9px] text-[#4b5563] uppercase tracking-widest mb-1.5 font-semibold">Transaction Digest</p>
              <p className="text-white text-xs font-mono break-all bg-[#0d1117] rounded-lg p-2.5 border border-green-500/20">{data.txDigest}</p>
            </div>
            {intent && (
              <div className="flex gap-8">
                <div>
                  <p className="text-[9px] text-[#4b5563] uppercase tracking-widest mb-1 font-semibold">Action</p>
                  <p className="text-white text-sm capitalize font-medium">{intent.action}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#4b5563] uppercase tracking-widest mb-1 font-semibold">Amount</p>
                  <p className="text-white text-sm font-mono">{intent.amount} {intent.token_in}</p>
                </div>
                <div>
                  <p className="text-[9px] text-[#4b5563] uppercase tracking-widest mb-1 font-semibold">Status</p>
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 status-dot" /> Confirmed
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Explorer link */}
      {data.explorerUrl && (
        <a
          id="explorer-link"
          href={data.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-[#6fbcf0] hover:bg-[#6fbcf0]/10 hover:border-[#6fbcf0]/40 transition-all text-sm font-medium mb-8"
        >
          🔍 View on Suiscan ↗
        </a>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 justify-center mt-4">
        <button
          id="new-intent-btn"
          onClick={onReset}
          className="btn-primary px-8 py-3 bg-gradient-to-r from-[#6fbcf0] to-[#5ba3d9] text-[#0d1117] rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#6fbcf0]/20 transition-all active:scale-95"
        >
          New Intent →
        </button>
      </div>

      {/* Verify Backend Execution */}
      {data.langsmithUrl && (
        <div 
          onClick={() => window.open(data.langsmithUrl, '_blank')}
          className="mt-12 glass-card rounded-2xl p-6 border border-[#a78bfa]/30 hover:border-[#a78bfa]/60 transition-all cursor-pointer glow-purple text-left group mx-auto max-w-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#a78bfa] font-bold mb-1">Verifiable Backend Proof</p>
              <h3 className="text-white font-bold text-base group-hover:text-[#a78bfa] transition-colors">View AI Execution Trace on LangSmith ↗</h3>
              <p className="text-xs text-[#8b949e] mt-1.5 leading-relaxed">
                Click to verify exactly how Amazon Nova parsed your intent, compiled the PTB, and ran the guardian safety checks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Terminal Trace */}
      {data.backendTrace && <BackendTerminal trace={data.backendTrace} />}
    </div>
  );
}
