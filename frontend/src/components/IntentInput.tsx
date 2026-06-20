import React, { useState } from 'react';

interface Props {
  onSubmit: (input: string) => void;
}

const EXAMPLES = [
  { text: 'Send 0.1 SUI to 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', icon: '💸', label: 'Transfer' },
  { text: 'Swap 5 SUI for USDC', icon: '🔄', label: 'Swap' },
  { text: 'What is my current SUI balance?', icon: '📊', label: 'Balance' },
  { text: 'Transfer 0.5 SUI to 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', icon: '📤', label: 'Transfer' },
];

const PIPELINE_STEPS = [
  { num: '01', label: 'Parse Intent', desc: 'Gemini AI extracts your goal', icon: '🧠', color: 'from-blue-500 to-cyan-400' },
  { num: '02', label: 'Compile PTB', desc: 'Build Sui transaction block', icon: '⚙️', color: 'from-cyan-400 to-teal-400' },
  { num: '03', label: 'Guardian Check', desc: '5-layer risk analysis', icon: '🛡️', color: 'from-teal-400 to-emerald-400' },
  { num: '04', label: 'You Confirm', desc: 'Review before execution', icon: '✅', color: 'from-emerald-400 to-green-400' },
];

export default function IntentInput({ onSubmit }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSubmit(input.trim());
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[#6fbcf0] text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6fbcf0] status-dot" />
          Sui Testnet · Guardian Protected
        </div>
        <h2 className="text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
          What do you want<br />
          <span className="text-gradient">to do on Sui?</span>
        </h2>
        <p className="text-[#8b949e] text-base leading-relaxed max-w-lg mx-auto">
          Describe your goal in plain English. SuiGuard compiles it into a Sui PTB,
          runs a 5-layer risk analysis, and shows you exactly what will happen before you confirm.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="relative glass-card rounded-2xl overflow-hidden border-animated glow-blue focus-within:glow-blue transition-all">
          <textarea
            id="intent-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. Send 0.5 SUI to 0x... or Swap 10 SUI for USDC"
            rows={3}
            className="w-full px-6 pt-5 pb-16 bg-transparent text-white placeholder-[#4b5563] text-base resize-none outline-none font-sans"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) onSubmit(input.trim());
              }
            }}
          />
          <div className="absolute bottom-4 right-4">
            <button
              id="submit-intent-btn"
              type="submit"
              disabled={!input.trim()}
              className="btn-primary px-6 py-2.5 bg-gradient-to-r from-[#6fbcf0] to-[#5ba3d9] text-[#0d1117] rounded-xl font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#6fbcf0]/20 transition-all active:scale-95"
            >
              Analyse →
            </button>
          </div>
          <div className="absolute bottom-4 left-6">
            <span className="text-[#4b5563] text-xs">Enter to submit · Shift+Enter for new line</span>
          </div>
        </div>
      </form>

      {/* Examples */}
      <div className="mb-12">
        <p className="text-[#4b5563] text-[10px] mb-3 font-semibold uppercase tracking-[0.15em]">Try an example</p>
        <div className="flex flex-col gap-2 stagger-children">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              id={`example-btn-${i}`}
              onClick={() => setInput(ex.text)}
              className="animate-fade-in-up text-left px-4 py-3 rounded-xl glass-card hover:border-[#6fbcf0]/30 hover:bg-[#6fbcf0]/5 transition-all text-sm group"
            >
              <div className="flex items-center gap-3">
                <span className="text-base opacity-60 group-hover:opacity-100 transition-opacity">{ex.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[#8b949e] group-hover:text-white transition-colors truncate block">{ex.text}</span>
                </div>
                <span className="text-[10px] font-medium text-[#4b5563] px-2 py-0.5 rounded-md bg-[#161b22] border border-[#30363d] group-hover:text-[#6fbcf0] group-hover:border-[#6fbcf0]/30 transition-all">{ex.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Architecture */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs">⚡</span>
          <p className="text-[10px] text-[#8b949e] font-semibold uppercase tracking-[0.15em]">How the intent engine works</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={i} className="text-center group">
              <div className="relative mb-3">
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${step.color} p-[1px]`}>
                  <div className="w-full h-full rounded-xl bg-[#0d1117] flex items-center justify-center text-lg">
                    {step.icon}
                  </div>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="absolute top-1/2 -right-2 w-4 h-[1px] bg-gradient-to-r from-[#30363d] to-transparent hidden lg:block" />
                )}
              </div>
              <p className="text-white text-xs font-semibold mb-0.5">{step.label}</p>
              <p className="text-[#4b5563] text-[10px] leading-tight">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
