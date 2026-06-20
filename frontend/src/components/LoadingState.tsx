import React from 'react';

interface Props {
  message: string;
}

export default function LoadingState({ message }: Props) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in-up">
      {/* Animated spinner */}
      <div className="relative w-16 h-16 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-[#30363d]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6fbcf0] animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#6fbcf0]/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>

      {/* Message */}
      <p className="text-white text-lg font-medium mb-3">{message}</p>

      {/* Animated dots */}
      <div className="flex justify-center gap-1.5 mb-8">
        <div className="w-2 h-2 rounded-full bg-[#6fbcf0] pulse-dot" />
        <div className="w-2 h-2 rounded-full bg-[#6fbcf0] pulse-dot" />
        <div className="w-2 h-2 rounded-full bg-[#6fbcf0] pulse-dot" />
      </div>

      {/* Pipeline stages */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#8b949e]">
        <StageIndicator label="Parse" active={message.includes('Parsing')} done={message.includes('Compiling') || message.includes('Guardian') || message.includes('Signing')} />
        <span className="text-[#30363d]">→</span>
        <StageIndicator label="Compile PTB" active={message.includes('Compiling')} done={message.includes('Guardian') || message.includes('Signing')} />
        <span className="text-[#30363d]">→</span>
        <StageIndicator label="Guardian" active={message.includes('Guardian')} done={message.includes('Signing')} />
        <span className="text-[#30363d]">→</span>
        <StageIndicator label="Execute" active={message.includes('Signing')} done={false} />
      </div>
    </div>
  );
}

function StageIndicator({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
      done
        ? 'border-green-500/40 bg-green-500/10 text-green-400'
        : active
        ? 'border-[#6fbcf0]/40 bg-[#6fbcf0]/10 text-[#6fbcf0]'
        : 'border-[#30363d] bg-transparent text-[#8b949e]'
    }`}>
      {done ? '✓ ' : active ? '● ' : ''}{label}
    </div>
  );
}
