import React, { useState } from 'react';
import { IntentResponse } from '../App';

interface Props {
  data: IntentResponse;
  onConfirm: (confirmed: boolean) => void;
}

function RiskBadge({ level }: { level: string }) {
  const colors = {
    PASS: 'bg-green-500/10 text-green-400 border-green-500/30',
    WARN: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    BLOCK: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  const icons = { PASS: '✓', WARN: '⚠', BLOCK: '✕' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${colors[level as keyof typeof colors] || colors.WARN}`}>
      {icons[level as keyof typeof icons] || '?'} {level}
    </span>
  );
}

function RiskScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = !passed ? '#f85149' : score > 30 ? '#d29922' : '#3fb950';

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#30363d" strokeWidth="4" />
        <circle
          cx="40" cy="40" r={radius} fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[10px] text-[#8b949e]">Risk</span>
      </div>
    </div>
  );
}

export default function GuardianReview({ data, onConfirm }: Props) {
  const { intent, ptbPreview, guardianResult, walletBalance, walletAddress } = data;
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Guardian Review</h2>
        <p className="text-[#8b949e] text-sm">
          Review the analysis below before confirming your transaction
        </p>
      </div>

      {/* Intent Summary */}
      <div className="p-5 rounded-xl border border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#6fbcf0]">📝</span>
          <h3 className="text-sm font-semibold text-white">Parsed Intent</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-0.5">Action</p>
            <p className="text-white text-sm font-medium capitalize">{intent?.action}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-0.5">Amount</p>
            <p className="text-white text-sm font-mono">{intent?.amount} {intent?.token_in}</p>
          </div>
          {intent?.token_out && (
            <div>
              <p className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-0.5">Receiving</p>
              <p className="text-white text-sm font-mono">{intent.token_out}</p>
            </div>
          )}
          {intent?.recipient && (
            <div className="col-span-2">
              <p className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-0.5">Recipient</p>
              <p className="text-white text-xs font-mono break-all">{intent.recipient}</p>
            </div>
          )}
        </div>
      </div>

      {/* PTB Steps */}
      <div className="p-5 rounded-xl border border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#6fbcf0]">⚙️</span>
          <h3 className="text-sm font-semibold text-white">Programmable Transaction Block</h3>
        </div>
        <div className="space-y-2">
          {ptbPreview?.steps.map((step: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#0d1117]/50">
              <span className="text-[#6fbcf0] text-xs font-mono mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-white text-sm">{step.replace(/^[①②③④⑤]\s*/, '')}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 pt-3 border-t border-[#30363d]">
          <div>
            <p className="text-[10px] text-[#8b949e] uppercase tracking-wider">Est. Gas</p>
            <p className="text-white text-xs font-mono">{ptbPreview?.estimatedGas}</p>
          </div>
          {ptbPreview?.estimatedOutput && (
            <div className="text-right">
              <p className="text-[10px] text-[#8b949e] uppercase tracking-wider">Est. Output</p>
              <p className="text-[#6fbcf0] text-xs font-mono">{ptbPreview.estimatedOutput}</p>
            </div>
          )}
        </div>
      </div>

      {/* Guardian Risk Analysis */}
      <div className={`p-5 rounded-xl border bg-[#161b22] ${
        !guardianResult?.passed ? 'border-red-500/40 glow-red' :
        guardianResult?.riskScore > 0 ? 'border-yellow-500/40 glow-yellow' :
        'border-green-500/40 glow-green'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <span>🛡️</span>
          <h3 className="text-sm font-semibold text-white">Guardian Risk Analysis</h3>
        </div>

        <RiskScoreRing score={guardianResult?.riskScore || 0} passed={guardianResult?.passed || false} />

        <p className={`text-center text-sm font-medium mt-3 mb-4 ${
          !guardianResult?.passed ? 'text-red-400' :
          guardianResult?.riskScore > 0 ? 'text-yellow-400' :
          'text-green-400'
        }`}>
          {guardianResult?.summary}
        </p>

        {/* Risk flags */}
        <div className="space-y-2">
          {guardianResult?.flags.map((flag: any, i: number) => (
            <div
              key={i}
              className={`rounded-lg border cursor-pointer transition-all ${
                flag.level === 'BLOCK' ? 'border-red-500/30 bg-red-500/5' :
                flag.level === 'WARN' ? 'border-yellow-500/30 bg-yellow-500/5' :
                'border-green-500/30 bg-green-500/5'
              }`}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <RiskBadge level={flag.level} />
                  <div>
                    <p className="text-xs font-medium text-[#8b949e]">{flag.class}</p>
                    <p className="text-sm text-white">{flag.message}</p>
                  </div>
                </div>
                <span className={`text-[#8b949e] transition-transform ${expanded === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </div>
              {expanded === i && (
                <div className="px-3 pb-3 pt-0">
                  <p className="text-xs text-[#8b949e] leading-relaxed pl-[52px]">{flag.detail}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Wallet info */}
      <div className="p-4 rounded-xl border border-[#30363d] bg-[#161b22]/50 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-[#8b949e] uppercase tracking-wider">Signing Wallet</p>
          <p className="text-white text-xs font-mono">{walletAddress.slice(0, 12)}...{walletAddress.slice(-8)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#8b949e] uppercase tracking-wider">Balance</p>
          <p className="text-[#6fbcf0] text-xs font-mono font-medium">{walletBalance.toFixed(4)} SUI</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          id="cancel-btn"
          onClick={() => onConfirm(false)}
          className="flex-1 py-3 rounded-xl border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:text-white hover:border-[#6fbcf0]/40 transition-all font-medium text-sm"
        >
          Cancel
        </button>
        {guardianResult?.passed ? (
          <button
            id="confirm-btn"
            onClick={() => onConfirm(true)}
            className="flex-1 py-3 rounded-xl bg-[#6fbcf0] text-[#0d1117] font-semibold text-sm hover:bg-[#6fbcf0]/90 transition-all active:scale-[0.98]"
          >
            Confirm & Execute →
          </button>
        ) : (
          <button
            disabled
            className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-sm cursor-not-allowed"
          >
            Blocked by Guardian
          </button>
        )}
      </div>

      {/* LangSmith link */}
      {data.langsmithUrl && (
        <div className="text-center">
          <a
            href={data.langsmithUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#8b949e] hover:text-[#6fbcf0] transition-colors"
          >
            View full trace on LangSmith ↗
          </a>
        </div>
      )}
    </div>
  );
}
