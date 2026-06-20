import React, { useState } from 'react';
import { IntentResponse } from '../App';

interface Props {
  data: IntentResponse;
  onConfirm: (confirmed: boolean) => void;
}

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

function RiskScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = !passed ? '#f85149' : score > 30 ? '#d29922' : '#3fb950';
  const label = !passed ? 'BLOCKED' : score > 30 ? 'CAUTION' : 'SAFE';

  return (
    <div className="relative w-28 h-28 mx-auto ring-glow" style={{ color }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="rgba(48,54,61,0.5)" strokeWidth="3" />
        <circle
          cx="44" cy="44" r={radius} fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color, opacity: 0.8 }}>{label}</span>
      </div>
    </div>
  );
}

export default function GuardianReview({ data, onConfirm }: Props) {
  const { intent, ptbPreview, guardianResult, walletBalance, walletAddress } = data;
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🛡️ Guardian Review</h2>
        <p className="text-[#8b949e] text-sm">
          Review the analysis below before confirming your transaction
        </p>
      </div>

      {/* Intent Summary */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">📝</span>
          <h3 className="text-sm font-semibold text-white">Parsed Intent</h3>
          <span className="ml-auto text-[9px] px-2 py-0.5 rounded-md bg-[#6fbcf0]/10 text-[#6fbcf0] border border-[#6fbcf0]/20 font-medium uppercase tracking-wider">
            {intent?.action}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] text-[#4b5563] uppercase tracking-widest mb-1 font-semibold">Action</p>
            <p className="text-white text-sm font-medium capitalize">{intent?.action}</p>
          </div>
          <div>
            <p className="text-[9px] text-[#4b5563] uppercase tracking-widest mb-1 font-semibold">Amount</p>
            <p className="text-white text-sm font-mono">{intent?.amount} {intent?.token_in}</p>
          </div>
          {intent?.token_out && (
            <div>
              <p className="text-[9px] text-[#4b5563] uppercase tracking-widest mb-1 font-semibold">Receiving</p>
              <p className="text-white text-sm font-mono">{intent.token_out}</p>
            </div>
          )}
          {intent?.recipient && (
            <div className="col-span-2">
              <p className="text-[9px] text-[#4b5563] uppercase tracking-widest mb-1 font-semibold">Recipient</p>
              <p className="text-white text-xs font-mono break-all bg-[#0d1117] rounded-lg p-2 border border-[#30363d]/50">{intent.recipient}</p>
            </div>
          )}
        </div>
      </div>

      {/* PTB Steps */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">⚙️</span>
          <h3 className="text-sm font-semibold text-white">Programmable Transaction Block</h3>
        </div>
        <div className="space-y-2">
          {ptbPreview?.steps.map((step: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#0d1117]/60 border border-[#30363d]/30">
              <span className="text-[#6fbcf0] text-xs font-mono mt-0.5 w-6 text-center font-bold">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-white text-sm leading-relaxed">{step.replace(/^[①②③④⑤]\s*/, '')}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t border-[#30363d]/30">
          <div>
            <p className="text-[9px] text-[#4b5563] uppercase tracking-widest font-semibold">Est. Gas</p>
            <p className="text-white text-xs font-mono">{ptbPreview?.estimatedGas}</p>
          </div>
          {ptbPreview?.estimatedOutput && (
            <div className="text-right">
              <p className="text-[9px] text-[#4b5563] uppercase tracking-widest font-semibold">Est. Output</p>
              <p className="text-[#6fbcf0] text-xs font-mono font-semibold">{ptbPreview.estimatedOutput}</p>
            </div>
          )}
        </div>
      </div>

      {/* Guardian Risk Analysis */}
      <div className={`glass-card rounded-2xl p-5 ${
        !guardianResult?.passed ? 'border-red-500/30 glow-red' :
        guardianResult?.riskScore > 0 ? 'border-yellow-500/30 glow-yellow' :
        'border-green-500/30 glow-green'
      }`}>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-base">🛡️</span>
          <h3 className="text-sm font-semibold text-white">Guardian Risk Analysis</h3>
          <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border" style={{
            color: !guardianResult?.passed ? '#f85149' : guardianResult?.riskScore > 0 ? '#d29922' : '#3fb950',
            borderColor: !guardianResult?.passed ? 'rgba(248,81,73,0.3)' : guardianResult?.riskScore > 0 ? 'rgba(210,153,34,0.3)' : 'rgba(63,185,80,0.3)',
            backgroundColor: !guardianResult?.passed ? 'rgba(248,81,73,0.1)' : guardianResult?.riskScore > 0 ? 'rgba(210,153,34,0.1)' : 'rgba(63,185,80,0.1)',
          }}>
            {!guardianResult?.passed ? 'Blocked' : guardianResult?.riskScore > 0 ? 'Warnings' : 'All Clear'}
          </span>
        </div>

        <RiskScoreRing score={guardianResult?.riskScore || 0} passed={guardianResult?.passed || false} />

        <p className={`text-center text-sm font-medium mt-4 mb-5 ${
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
              className={`rounded-xl border cursor-pointer transition-all ${
                flag.level === 'BLOCK' ? 'border-red-500/20 bg-red-500/5 hover:border-red-500/40' :
                flag.level === 'WARN' ? 'border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40' :
                'border-green-500/20 bg-green-500/5 hover:border-green-500/40'
              }`}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <RiskBadge level={flag.level} />
                  <div>
                    <p className="text-[10px] font-semibold text-[#8b949e] uppercase tracking-wider">{flag.class}</p>
                    <p className="text-sm text-white">{flag.message}</p>
                  </div>
                </div>
                <span className={`text-[#8b949e] transition-transform duration-200 ${expanded === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </div>
              {expanded === i && (
                <div className="px-4 pb-3 pt-0">
                  <p className="text-xs text-[#8b949e] leading-relaxed pl-[60px] border-t border-[#30363d]/30 pt-2">{flag.detail}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Wallet info */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center">
            <span className="text-xs">💰</span>
          </div>
          <div>
            <p className="text-[9px] text-[#4b5563] uppercase tracking-widest font-semibold">Signing Wallet</p>
            <p className="text-white text-xs font-mono">{walletAddress.slice(0, 10)}···{walletAddress.slice(-6)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-[#4b5563] uppercase tracking-widest font-semibold">Balance</p>
          <p className="text-[#6fbcf0] text-sm font-mono font-bold">{walletBalance.toFixed(4)} SUI</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          id="cancel-btn"
          onClick={() => onConfirm(false)}
          className="flex-1 py-3.5 rounded-xl glass text-[#8b949e] hover:text-white hover:border-[#6fbcf0]/30 transition-all font-medium text-sm"
        >
          ← Cancel
        </button>
        {guardianResult?.passed ? (
          <button
            id="confirm-btn"
            onClick={() => onConfirm(true)}
            className="btn-primary flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#6fbcf0] to-[#5ba3d9] text-[#0d1117] font-bold text-sm hover:shadow-lg hover:shadow-[#6fbcf0]/20 transition-all active:scale-[0.98]"
          >
            Confirm & Execute →
          </button>
        ) : (
          <button
            disabled
            className="flex-1 py-3.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm cursor-not-allowed"
          >
            🚫 Blocked by Guardian
          </button>
        )}
      </div>

      {/* LangSmith link */}
      {data.langsmithUrl && (
        <div className="text-center pt-2">
          <a
            href={data.langsmithUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#4b5563] hover:text-[#6fbcf0] transition-colors"
          >
            View full trace on LangSmith ↗
          </a>
        </div>
      )}
    </div>
  );
}
