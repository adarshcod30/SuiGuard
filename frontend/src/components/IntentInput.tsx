import React, { useState } from 'react';

interface Props {
  onSubmit: (input: string) => void;
}

const EXAMPLES = [
  { text: 'Send 0.1 SUI to 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', label: 'Transfer' },
  { text: 'Swap 5 SUI for USDC', label: 'Swap' },
  { text: 'What is my current SUI balance?', label: 'Balance' },
];

const PIPELINE_STEPS = [
  { num: '01', label: 'Parse Intent', desc: 'Amazon Nova extracts your goal', color: 'from-blue-500 to-cyan-400' },
  { num: '02', label: 'Compile PTB', desc: 'Build Sui transaction block', color: 'from-cyan-400 to-teal-400' },
  { num: '03', label: 'Guardian Check', desc: '5-layer risk analysis', color: 'from-teal-400 to-emerald-400' },
  { num: '04', label: 'You Confirm', desc: 'Review before execution', color: 'from-emerald-400 to-green-400' },
];

export default function IntentInput({ onSubmit }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSubmit(input.trim());
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Hero */}
      <div className="text-center mb-16 mt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[#6fbcf0] text-xs font-medium mb-10 border border-[#6fbcf0]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6fbcf0] status-dot" />
          Sui Mainnet · Guardian Protected
        </div>
        <h2 className="text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
          What do you want<br />
          <span className="text-gradient">to do on Sui?</span>
        </h2>
        <p className="text-[#8b949e] text-lg leading-relaxed max-w-xl mx-auto">
          Describe your goal in plain English. SuiGuard compiles it into a Sui PTB,
          runs a 5-layer risk analysis, and shows you exactly what will happen before you confirm.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="relative glass-card rounded-3xl overflow-hidden border-animated glow-blue focus-within:glow-blue transition-all">
          <textarea
            id="intent-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. Send 0.5 SUI to 0x... or Swap 10 SUI for USDC"
            rows={3}
            className="w-full px-8 pt-8 pb-20 bg-transparent text-white placeholder-[#4b5563] text-xl resize-none outline-none font-sans font-medium"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) onSubmit(input.trim());
              }
            }}
          />
          <div className="absolute bottom-6 right-6">
            <button
              id="submit-intent-btn"
              type="submit"
              disabled={!input.trim()}
              className="btn-primary px-8 py-3 bg-gradient-to-r from-[#6fbcf0] to-[#5ba3d9] text-[#0d1117] rounded-xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#6fbcf0]/20 transition-all active:scale-95 uppercase tracking-wider"
            >
              Analyse Intent
            </button>
          </div>
          <div className="absolute bottom-6 left-8">
            <span className="text-[#4b5563] text-xs font-semibold">Enter to submit · Shift+Enter for new line</span>
          </div>
        </div>
      </form>

      {/* Examples */}
      <div className="mb-16">
        <p className="text-[#4b5563] text-[10px] mb-4 font-bold uppercase tracking-[0.2em] text-center">Try an example</p>
        <div className="flex flex-col gap-3 stagger-children">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              id={`example-btn-${i}`}
              onClick={() => setInput(ex.text)}
              className="animate-fade-in-up text-left px-5 py-4 rounded-xl glass-card hover:border-[#6fbcf0]/30 hover:bg-[#6fbcf0]/5 transition-all text-sm group"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-[#8b949e] group-hover:text-white transition-colors truncate block text-base font-medium">{ex.text}</span>
                </div>
                <span className="text-[10px] font-bold text-[#4b5563] px-3 py-1 rounded-md bg-[#161b22] border border-[#30363d] group-hover:text-[#6fbcf0] group-hover:border-[#6fbcf0]/30 transition-all uppercase tracking-wider">{ex.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Architecture */}
      <div className="glass-card rounded-3xl p-8 border border-[#30363d]/50">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-[#6fbcf0]"></div>
          <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-[0.2em]">How the intent engine works</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={i} className="text-center group relative">
              <div className="relative mb-4">
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${step.color} p-[1px]`}>
                  <div className="w-full h-full rounded-2xl bg-[#0d1117] flex items-center justify-center font-mono text-lg font-bold text-white opacity-80 group-hover:opacity-100 transition-opacity">
                    {step.num}
                  </div>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="absolute top-1/2 -right-3 w-6 h-[1px] bg-gradient-to-r from-[#30363d] to-transparent hidden md:block" />
                )}
              </div>
              <p className="text-white text-sm font-bold mb-1">{step.label}</p>
              <p className="text-[#8b949e] text-[10px] leading-tight">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
