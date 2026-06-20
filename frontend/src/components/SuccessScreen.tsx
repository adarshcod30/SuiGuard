import React from 'react';
import { ExecuteResponse } from '../App';

interface Props {
  data: ExecuteResponse;
  intent: any;
  onReset: () => void;
}

export default function SuccessScreen({ data, intent, onReset }: Props) {
  const isBalanceQuery = data.txDigest === 'NO_TX_BALANCE_QUERY';

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
      {/* Success icon */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="relative w-full h-full rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center glow-green">
          <span className="text-4xl">✓</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {isBalanceQuery ? 'Balance Retrieved' : 'Transaction Successful!'}
      </h2>
      <p className="text-[#8b949e] text-sm mb-8">
        {isBalanceQuery
          ? 'Your wallet balance has been queried successfully.'
          : 'Your transaction has been confirmed on the Sui testnet.'
        }
      </p>

      {/* Transaction details */}
      {!isBalanceQuery && data.txDigest && (
        <div className="p-5 rounded-xl border border-green-500/30 bg-green-500/5 glow-green mb-6 text-left">
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1">Transaction Digest</p>
              <p className="text-white text-xs font-mono break-all">{data.txDigest}</p>
            </div>
            {intent && (
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1">Action</p>
                  <p className="text-white text-sm capitalize">{intent.action}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-white text-sm font-mono">{intent.amount} {intent.token_in}</p>
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#6fbcf0]/30 bg-[#6fbcf0]/5 text-[#6fbcf0] hover:bg-[#6fbcf0]/10 transition-all text-sm font-medium mb-6"
        >
          View on Suiscan ↗
        </a>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 justify-center mt-4">
        <button
          id="new-intent-btn"
          onClick={onReset}
          className="px-6 py-2.5 bg-[#6fbcf0] text-[#0d1117] rounded-lg font-semibold text-sm hover:bg-[#6fbcf0]/90 transition-colors active:scale-95"
        >
          New Intent
        </button>
      </div>

      {/* LangSmith */}
      {data.langsmithUrl && (
        <div className="mt-6">
          <a
            href={data.langsmithUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#8b949e] hover:text-[#6fbcf0] transition-colors"
          >
            View full execution trace on LangSmith ↗
          </a>
        </div>
      )}
    </div>
  );
}
