import React from 'react';

interface Props {
  message: string;
}

const STAGES = [
  { key: 'Parse', icon: '🧠', label: 'Parse Intent' },
  { key: 'Compile', icon: '⚙️', label: 'Compile PTB' },
  { key: 'Guardian', icon: '🛡️', label: 'Guardian' },
  { key: 'Sign', icon: '⚡', label: 'Execute' },
];

function getStageState(message: string, stageKey: string): 'idle' | 'active' | 'done' {
  const order = ['Pars', 'Compil', 'Guardian', 'Sign'];
  const currentIdx = order.findIndex(k => message.includes(k));
  const stageIdx = order.findIndex(k => stageKey.startsWith(k.slice(0, 4)));
  
  if (stageIdx < currentIdx) return 'done';
  if (stageIdx === currentIdx) return 'active';
  return 'idle';
}

export default function LoadingState({ message }: Props) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in-up">
      {/* Animated orb */}
      <div className="relative w-24 h-24 mx-auto mb-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6fbcf0]/20 to-[#a78bfa]/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#6fbcf0]/10 to-[#a78bfa]/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
        <div className="relative w-full h-full rounded-full glass flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-[#6fbcf0] border-r-[#a78bfa] animate-spin" />
          <div className="absolute w-10 h-10 rounded-full border-2 border-transparent border-b-[#6fbcf0]/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>

      {/* Message */}
      <p className="text-white text-xl font-semibold mb-2">{message}</p>
      <p className="text-[#4b5563] text-sm mb-10">This usually takes a few seconds</p>

      {/* Animated dots */}
      <div className="flex justify-center gap-2 mb-10">
        <div className="w-2 h-2 rounded-full bg-[#6fbcf0] pulse-dot" />
        <div className="w-2 h-2 rounded-full bg-[#a78bfa] pulse-dot" />
        <div className="w-2 h-2 rounded-full bg-[#6fbcf0] pulse-dot" />
      </div>

      {/* Pipeline stages */}
      <div className="flex items-center justify-center gap-2">
        {STAGES.map((stage, i) => {
          const state = getStageState(message, stage.key);
          return (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-500 ${
                state === 'done'
                  ? 'glass border-green-500/30 text-green-400'
                  : state === 'active'
                  ? 'glass border-[#6fbcf0]/40 text-[#6fbcf0] glow-blue'
                  : 'border border-[#30363d]/50 bg-transparent text-[#4b5563]'
              }`}>
                <span className="text-sm">{state === 'done' ? '✓' : stage.icon}</span>
                <span>{stage.label}</span>
              </div>
              {i < STAGES.length - 1 && (
                <div className={`w-6 h-[1px] transition-all duration-500 ${
                  state === 'done' ? 'bg-green-500/40' : 'bg-[#30363d]/50'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
