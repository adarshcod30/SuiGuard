import React, { useState } from 'react';

interface Props {
  onSubmit: (input: string) => void;
}

const EXAMPLES = [
  'Send 0.1 SUI to 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  'Swap 5 SUI for USDC',
  'What is my current SUI balance?',
  'Transfer 0.5 SUI to 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
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
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6fbcf0]/30 bg-[#6fbcf0]/5 text-[#6fbcf0] text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6fbcf0] animate-pulse" />
          Sui Testnet · Guardian Protected
        </div>
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
          What do you want<br />
          <span className="text-[#6fbcf0]">to do on Sui?</span>
        </h2>
        <p className="text-[#8b949e] text-base leading-relaxed max-w-md mx-auto">
          Describe your goal in plain English. SuiGuard compiles it into a Sui PTB,
          runs a risk analysis, and shows you exactly what will happen before you confirm.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative border border-[#30363d] rounded-xl bg-[#161b22] overflow-hidden border-animated glow-blue focus-within:border-[#6fbcf0]/60 transition-all">
          <textarea
            id="intent-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. Send 0.5 SUI to 0x..."
            rows={3}
            className="w-full px-5 pt-4 pb-14 bg-transparent text-white placeholder-[#8b949e] text-base resize-none outline-none font-sans"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) onSubmit(input.trim());
              }
            }}
          />
          <div className="absolute bottom-3 right-3">
            <button
              id="submit-intent-btn"
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-2 bg-[#6fbcf0] text-[#0d1117] rounded-lg font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6fbcf0]/90 transition-all active:scale-95"
            >
              Analyse →
            </button>
          </div>
          <div className="absolute bottom-4 left-5">
            <span className="text-[#8b949e] text-xs">Press Enter to submit · Shift+Enter for new line</span>
          </div>
        </div>
      </form>

      {/* Examples */}
      <div>
        <p className="text-[#8b949e] text-xs mb-3 font-medium uppercase tracking-wider">Try an example</p>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              id={`example-btn-${i}`}
              onClick={() => setInput(ex)}
              className="text-left px-4 py-2.5 rounded-lg border border-[#30363d] bg-[#161b22]/50 text-[#8b949e] hover:text-white hover:border-[#6fbcf0]/40 hover:bg-[#6fbcf0]/5 transition-all text-sm truncate"
            >
              <span className="text-[#6fbcf0] mr-2">→</span>
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Architecture info */}
      <div className="mt-12 p-4 rounded-xl border border-[#30363d] bg-[#161b22]/30">
        <p className="text-xs text-[#8b949e] mb-3 font-medium uppercase tracking-wider">How it works</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { num: '①', label: 'Parse Intent', desc: 'GPT-4o-mini extracts your goal' },
            { num: '②', label: 'Compile PTB', desc: 'Build Sui transaction block' },
            { num: '③', label: 'Guardian Check', desc: '5-layer risk analysis' },
            { num: '④', label: 'You Confirm', desc: 'Review before execution' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-[#6fbcf0] text-lg mb-1">{step.num}</div>
              <p className="text-white text-xs font-medium mb-0.5">{step.label}</p>
              <p className="text-[#8b949e] text-[10px] leading-tight">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
