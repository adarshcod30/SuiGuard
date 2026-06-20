import React, { useState, useEffect } from 'react';

interface Props {
  trace: string[];
}

export default function BackendTerminal({ trace }: Props) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && visibleLines < trace.length) {
      const timer = setTimeout(() => {
        setVisibleLines(v => v + 1);
      }, 150); // Typing speed
      return () => clearTimeout(timer);
    }
  }, [isOpen, visibleLines, trace.length]);

  if (!trace || trace.length === 0) return null;

  return (
    <div className="mt-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-lg border border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:text-white hover:border-[#6fbcf0]/50 transition-colors text-xs font-mono"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          View Live Backend Trace
        </button>
      ) : (
        <div className="max-w-3xl mx-auto glass-card rounded-xl overflow-hidden border-[#30363d]/50 shadow-2xl animate-fade-in-up">
          <div className="flex items-center justify-between bg-[#0d1117] px-4 py-2 border-b border-[#30363d]/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIsOpen(false)}></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-2 text-xs font-mono text-[#8b949e]">node backend/intentEngine.ts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-wider text-green-400 font-bold">Live Execution Trace</span>
            </div>
          </div>
          <div className="p-4 bg-[#0a0e17] max-h-[400px] overflow-y-auto text-left font-mono text-xs leading-relaxed">
            {trace.slice(0, visibleLines).map((line, i) => {
              // Syntax highlighting for specific prefixes
              let color = 'text-[#e6edf3]';
              if (line.startsWith('[System]')) color = 'text-[#6fbcf0]';
              if (line.startsWith('[LLM]')) color = 'text-[#a78bfa]';
              if (line.startsWith('[PTB_Compiler]')) color = 'text-[#3fb950]';
              if (line.startsWith('[Guardian]')) color = 'text-[#d29922]';
              
              const isJson = line.includes('{') || line.includes('}');
              
              return (
                <div key={i} className={`mb-1 ${color} ${isJson ? 'pl-4 opacity-80' : ''}`}>
                  {isJson ? <pre className="whitespace-pre-wrap">{line}</pre> : <span>{line}</span>}
                </div>
              );
            })}
            {visibleLines < trace.length && (
              <div className="animate-pulse w-2 h-4 bg-white mt-1"></div>
            )}
            {visibleLines === trace.length && (
              <div className="text-[#3fb950] mt-3">✨ Process finished with exit code 0</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
