import React from 'react';

interface Props {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e6edf3] font-sans selection:bg-[#6fbcf0]/30 overflow-x-hidden">
      
      {/* ─── NAVBAR ─── */}
      <nav className="border-b border-[#30363d]/50 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6fbcf0] to-[#5ba3d9] flex items-center justify-center shadow-lg shadow-[#6fbcf0]/20">
              <div className="w-4 h-4 border-2 border-[#0d1117] rounded-sm"></div>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">SuiGuard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8b949e]">
            <span className="text-white">Overview</span>
            <span className="hover:text-white cursor-pointer transition-colors">Intent Engine</span>
            <span className="hover:text-white cursor-pointer transition-colors">Guardian Checks</span>
            <span className="hover:text-white cursor-pointer transition-colors">Execution Log</span>
          </div>
          <button 
            onClick={onLaunch}
            className="px-5 py-2 rounded-full bg-[#6fbcf0] text-[#0d1117] font-bold text-sm hover:bg-[#5ba3d9] transition-colors shadow-lg shadow-[#6fbcf0]/20"
          >
            Launch Engine
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* ─── STATS ROW ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-[#30363d]/30">
          <div>
            <p className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold mb-2">Transaction Speed</p>
            <p className="text-4xl font-bold text-white mb-1">2s</p>
            <p className="text-xs text-[#6fbcf0] font-medium">Bedrock + PTB Pipeline</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold mb-2">Guardian Security</p>
            <p className="text-4xl font-bold text-white mb-1">5-Tier</p>
            <p className="text-xs text-[#3fb950] font-medium">Pre-execution risk checks</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold mb-2">Network Execution</p>
            <p className="text-4xl font-bold text-white mb-1">100%</p>
            <p className="text-xs text-[#a78bfa] font-medium">Sui Testnet Verified</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold mb-2">User Abstraction</p>
            <p className="text-4xl font-bold text-white mb-1">Zero</p>
            <p className="text-xs text-[#d29922] font-medium">Blockchain jargon required</p>
          </div>
        </div>

        {/* ─── HERO SECTION ─── */}
        <div className="py-24 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6fbcf0]/30 bg-[#6fbcf0]/10 text-[#6fbcf0] text-[10px] font-bold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6fbcf0] animate-pulse"></span>
            AI-Powered Web3 Intent Engine
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8 tracking-tighter">
            An End-to-End <span className="text-gradient">AI Operating System</span> for Web3 Intents.
          </h1>
          
          <p className="text-lg md:text-xl text-[#8b949e] leading-relaxed max-w-2xl">
            SuiGuard replaces fragmented, dangerous DeFi interactions with a unified AI pipeline. It continuously parses natural language financial goals, compiles them into raw Sui Programmable Transaction Blocks, and performs deep risk analysis — all before you ever sign a transaction.
          </p>
        </div>

        {/* ─── ARCHITECTURE OVERVIEW ─── */}
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-[#30363d]/50 mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6fbcf0]/5 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="grid md:grid-cols-2 gap-16 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">System at a Glance</h2>
              <div className="space-y-6">
                <div className="border-b border-[#30363d]/50 pb-6">
                  <p className="text-[10px] text-[#3fb950] font-bold uppercase tracking-widest mb-1">Architecture</p>
                  <p className="text-sm text-white font-medium">3-Node Stateful Pipeline (LangGraph.js DAG)</p>
                </div>
                <div className="border-b border-[#30363d]/50 pb-6">
                  <p className="text-[10px] text-[#3fb950] font-bold uppercase tracking-widest mb-1">Gen AI Engine</p>
                  <p className="text-sm text-white font-medium">Amazon Nova (AWS Bedrock) + Structured Output</p>
                </div>
                <div className="border-b border-[#30363d]/50 pb-6">
                  <p className="text-[10px] text-[#3fb950] font-bold uppercase tracking-widest mb-1">Execution Layer</p>
                  <p className="text-sm text-white font-medium">Sui TypeScript SDK + Programmable Transaction Blocks</p>
                </div>
                <div className="pb-2">
                  <p className="text-[10px] text-[#3fb950] font-bold uppercase tracking-widest mb-1">Security Guardian</p>
                  <p className="text-sm text-white font-medium">Pre-flight Slippage, Balance, and Oracle Age simulation</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center bg-[#0d1117]/50 rounded-2xl p-8 border border-[#30363d]/30">
               <div className="w-full space-y-4">
                 <div className="flex items-center gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
                   <div className="w-8 h-8 rounded-full bg-[#6fbcf0]/20 flex items-center justify-center text-[#6fbcf0] font-mono text-xs">01</div>
                   <div>
                     <p className="text-sm font-bold text-white">Natural Language Ingestion</p>
                     <p className="text-xs text-[#8b949e]">"Swap 5 SUI for USDC"</p>
                   </div>
                 </div>
                 <div className="w-0.5 h-4 bg-[#30363d] mx-auto"></div>
                 <div className="flex items-center gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
                   <div className="w-8 h-8 rounded-full bg-[#a78bfa]/20 flex items-center justify-center text-[#a78bfa] font-mono text-xs">02</div>
                   <div>
                     <p className="text-sm font-bold text-white">PTB Compilation</p>
                     <p className="text-xs text-[#8b949e]">tx.splitCoins() → tx.moveCall()</p>
                   </div>
                 </div>
                 <div className="w-0.5 h-4 bg-[#30363d] mx-auto"></div>
                 <div className="flex items-center gap-4 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
                   <div className="w-8 h-8 rounded-full bg-[#3fb950]/20 flex items-center justify-center text-[#3fb950] font-mono text-xs">03</div>
                   <div>
                     <p className="text-sm font-bold text-white">Guardian Security Review</p>
                     <p className="text-xs text-[#8b949e]">Checking Slippage & Oracles</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* ─── CAPABILITIES ─── */}
        <div className="mb-24">
          <p className="text-[10px] text-[#6fbcf0] font-bold uppercase tracking-widest mb-4">Platform Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-12 tracking-tight">
            End-to-End <span className="text-[#3fb950]">Security &</span> <br /> Execution.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0d1117] rounded-3xl p-8 border border-[#30363d]/50 hover:border-[#6fbcf0]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#6fbcf0]/10 flex items-center justify-center text-[#6fbcf0] text-xl mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Intent Parsing Engine</h3>
              <p className="text-sm text-[#8b949e] leading-relaxed mb-6">
                Powered by Amazon Nova via AWS Bedrock, the system parses ambiguous natural language into structured JSON execution graphs.
              </p>
              <div className="mt-auto">
                <p className="text-[9px] uppercase tracking-widest text-[#3fb950] font-bold">Prototype: AWS Bedrock</p>
              </div>
            </div>

            <div className="bg-[#0d1117] rounded-3xl p-8 border border-[#30363d]/50 hover:border-[#a78bfa]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa] text-xl mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Pre-Flight Guardian</h3>
              <p className="text-sm text-[#8b949e] leading-relaxed mb-6">
                Before any transaction is signed, the Guardian simulates the execution — checking for high slippage, stale oracles, and drained balances.
              </p>
              <div className="mt-auto">
                <p className="text-[9px] uppercase tracking-widest text-[#3fb950] font-bold">Prototype: 5-Tier Rule Engine</p>
              </div>
            </div>

            <div className="bg-[#0d1117] rounded-3xl p-8 border border-[#30363d]/50 hover:border-[#d29922]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#d29922]/10 flex items-center justify-center text-[#d29922] text-xl mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Dual Mode UI</h3>
              <p className="text-sm text-[#8b949e] leading-relaxed mb-6">
                A UI built for everyone. Beginners get jargon-free 'Story Mode' cards, while experts get full access to the raw JSON serialized PTB payloads.
              </p>
              <div className="mt-auto">
                <p className="text-[9px] uppercase tracking-widest text-[#3fb950] font-bold">Prototype: React + Tailwind</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* ─── CTA ─── */}
        <div className="text-center pb-24">
          <button 
            onClick={onLaunch}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#6fbcf0] to-[#5ba3d9] text-[#0d1117] font-extrabold text-lg hover:shadow-xl hover:shadow-[#6fbcf0]/20 transition-all hover:-translate-y-1"
          >
            Enter SuiGuard Platform
          </button>
        </div>

      </main>
    </div>
  );
}
