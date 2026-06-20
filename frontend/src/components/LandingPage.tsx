import React from 'react';

interface Props {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: Props) {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e6edf3] font-sans selection:bg-[#6fbcf0]/30 overflow-x-hidden">
      
      {/* ─── NAVBAR ─── */}
      <nav className="border-b border-[#30363d]/50 bg-[#0d1117]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6fbcf0] to-[#5ba3d9] flex items-center justify-center shadow-lg shadow-[#6fbcf0]/20">
              <div className="w-4 h-4 border-2 border-[#0d1117] rounded-sm"></div>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">SuiGuard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8b949e]">
            <span onClick={() => scrollToSection('overview')} className="hover:text-white cursor-pointer transition-colors">Overview</span>
            <span onClick={() => scrollToSection('intent-engine')} className="hover:text-[#6fbcf0] cursor-pointer transition-colors">Intent Engine</span>
            <span onClick={() => scrollToSection('guardian-checks')} className="hover:text-[#a78bfa] cursor-pointer transition-colors">Guardian Checks</span>
            <span onClick={() => scrollToSection('execution-layer')} className="hover:text-[#3fb950] cursor-pointer transition-colors">Execution Layer</span>
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
        
        {/* ─── OVERVIEW / HERO ─── */}
        <section id="overview" className="scroll-mt-24">
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

          <div className="py-20 md:py-28 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6fbcf0]/30 bg-[#6fbcf0]/10 text-[#6fbcf0] text-[10px] font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6fbcf0] animate-pulse"></span>
              AI-Powered Web3 Intent Engine
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8 tracking-tighter">
              An End-to-End <span className="text-gradient">AI Operating System</span> for Web3 Intents.
            </h1>
            
            <p className="text-lg md:text-xl text-[#8b949e] leading-relaxed max-w-2xl">
              SuiGuard replaces fragmented, dangerous DeFi interactions with a unified AI pipeline. Built for the <strong>Sui Overflow 2026 Hackathon</strong>, it continuously parses natural language financial goals, compiles them into raw Sui Programmable Transaction Blocks, and performs deep risk analysis — all before you ever sign a transaction.
            </p>
          </div>
        </section>

        {/* ─── DEEP DIVE: INTENT ENGINE ─── */}
        <section id="intent-engine" className="scroll-mt-24 pt-16 mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-[#6fbcf0]/10 border border-[#6fbcf0]/20 flex items-center justify-center text-[#6fbcf0]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] text-[#6fbcf0] font-bold uppercase tracking-widest mb-1">Node 1: LangGraph Integration</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">The Intent Engine</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6 text-[#8b949e] leading-relaxed">
              <p>
                The days of users needing to understand liquidity pools, slippage tolerance, and gas limits are over. SuiGuard acts as a seamless translation layer between human desire and blockchain execution.
              </p>
              <p>
                Powered by <strong>Amazon Nova via AWS Bedrock</strong>, our LLM pipeline is strictly prompted to extract exact financial parameters from messy, ambiguous natural language inputs. Whether a user says "Swap 5 SUI for USDC" or "Liquidate 5 of my SUI into stablecoins right now", the engine normalizes the intent into a rigid JSON schema.
              </p>
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                <h4 className="text-white font-bold mb-4">Structured Output Enforcement</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-[#6fbcf0]">✓</span>
                    <span><strong>Action Type:</strong> Identifies if the intent is a transfer, swap, or balance query.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#6fbcf0]">✓</span>
                    <span><strong>Amount Parsing:</strong> Extracts numerical values and Normalizes to Mist (10^9).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#6fbcf0]">✓</span>
                    <span><strong>Token Resolution:</strong> Maps slang like "stables" to strict package IDs (e.g., USDC).</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Visual Code Mockup */}
            <div className="bg-[#0d1117] rounded-2xl border border-[#30363d] overflow-hidden shadow-2xl">
              <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-2 text-xs font-mono text-[#8b949e]">intent_parser.ts</span>
              </div>
              <div className="p-6 font-mono text-sm text-[#e6edf3] overflow-x-auto">
                <span className="text-[#ff7b72]">const</span> <span className="text-[#d2a8ff]">prompt</span> = <span className="text-[#a5d6ff]">`</span><br />
                <span className="text-[#a5d6ff]">  Extract intent into this JSON schema:</span><br />
                <span className="text-[#a5d6ff]">  {'{'}</span><br />
                <span className="text-[#a5d6ff]">    "action": "transfer" | "swap",</span><br />
                <span className="text-[#a5d6ff]">    "amount": number,</span><br />
                <span className="text-[#a5d6ff]">    "token_in": string,</span><br />
                <span className="text-[#a5d6ff]">    "token_out": string</span><br />
                <span className="text-[#a5d6ff]">  {'}'}</span><br />
                <span className="text-[#a5d6ff]">`</span>;<br /><br />
                <span className="text-[#8b949e]">// Input: "dump 10 sui for usdc"</span><br />
                <span className="text-[#ff7b72]">const</span> <span className="text-[#79c0ff]">result</span> = <span className="text-[#ff7b72]">await</span> <span className="text-[#d2a8ff]">llm</span>.<span className="text-[#d2a8ff]">invoke</span>(prompt);<br />
                <span className="text-[#8b949e]">// Returns: {"{"} action: "swap", amount: 10 ... {"}"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DEEP DIVE: GUARDIAN CHECKS ─── */}
        <section id="guardian-checks" className="scroll-mt-24 pt-16 mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-[#a78bfa]/10 border border-[#a78bfa]/20 flex items-center justify-center text-[#a78bfa]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] text-[#a78bfa] font-bold uppercase tracking-widest mb-1">Node 2: The Safety Layer</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">5-Tier Guardian Risk Analysis</h2>
            </div>
          </div>

          <p className="text-[#8b949e] text-lg max-w-3xl mb-12 leading-relaxed">
            Blindly executing AI-generated transactions is dangerous. Before the user is ever presented with a confirmation screen, the SuiGuard Guardian Node runs a deterministic simulation against the proposed Programmable Transaction Block (PTB).
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-[#30363d] hover:border-[#a78bfa]/50 transition-colors">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Slippage Protection
              </h3>
              <p className="text-sm text-[#8b949e]">Calculates trade size vs pool depth. Automatically blocks the transaction if price impact exceeds safe thresholds (>5%), preventing MEV sandwich attacks.</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl border border-[#30363d] hover:border-[#a78bfa]/50 transition-colors">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Oracle Staleness
              </h3>
              <p className="text-sm text-[#8b949e]">Queries the Sui network epoch to verify that the AMM pool's price oracle data is fresh. Stale pools are blocked to prevent trading on outdated rates.</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl border border-[#30363d] hover:border-[#a78bfa]/50 transition-colors">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6fbcf0]"></span> Balance Utilization
              </h3>
              <p className="text-sm text-[#8b949e]">Simulates gas fees alongside the trade amount. Warns the user if the transaction will drain >80% of their wallet, preventing "stuck" accounts.</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl border border-[#30363d] hover:border-[#a78bfa]/50 transition-colors">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3fb950]"></span> Recipient History
              </h3>
              <p className="text-sm text-[#8b949e]">For transfers, queries the blockchain to check if the destination address has ever transacted. Warns against sending funds to completely dormant/wrong addresses.</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl border border-[#30363d] hover:border-[#a78bfa]/50 transition-colors">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d29922]"></span> Trade Size Warnings
              </h3>
              <p className="text-sm text-[#8b949e]">Identifies unusually large transactions relative to standard network liquidity and suggests splitting them into smaller batches over time.</p>
            </div>
          </div>
        </section>

        {/* ─── DEEP DIVE: EXECUTION LAYER ─── */}
        <section id="execution-layer" className="scroll-mt-24 pt-16 mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-[#3fb950]/10 border border-[#3fb950]/20 flex items-center justify-center text-[#3fb950]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <div>
              <p className="text-[10px] text-[#3fb950] font-bold uppercase tracking-widest mb-1">Node 3: Blockchain Interoperability</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Programmable Transaction Blocks (PTBs)</h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-[#0d1117] rounded-2xl border border-[#30363d] overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="p-8 relative z-10">
                <div className="flex flex-col gap-4">
                  <div className="bg-[#161b22] border border-[#3fb950]/30 p-4 rounded-xl">
                    <p className="text-xs text-[#8b949e] mb-1">Command 0</p>
                    <p className="text-[#e6edf3] font-mono text-sm">tx.splitCoins(tx.gas, [amount])</p>
                  </div>
                  <div className="w-1 h-6 bg-[#30363d] mx-auto"></div>
                  <div className="bg-[#161b22] border border-[#a78bfa]/30 p-4 rounded-xl">
                    <p className="text-xs text-[#8b949e] mb-1">Command 1</p>
                    <p className="text-[#e6edf3] font-mono text-sm">tx.moveCall({`{ target: "0xCetus::router::swap" }`})</p>
                  </div>
                  <div className="w-1 h-6 bg-[#30363d] mx-auto"></div>
                  <div className="bg-[#161b22] border border-[#6fbcf0]/30 p-4 rounded-xl">
                    <p className="text-xs text-[#8b949e] mb-1">Execution</p>
                    <p className="text-[#e6edf3] font-mono text-sm">client.signAndExecuteTransaction()</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-6 text-[#8b949e] leading-relaxed">
              <p>
                Sui's unique architecture allows for incredibly complex DeFi operations to be batched into a single atomic transaction. SuiGuard leverages the <strong>@mysten/sui TypeScript SDK</strong> to build these blocks dynamically.
              </p>
              <p>
                When a swap intent is parsed, the engine doesn't just build a standard transfer. It constructs a highly optimized PTB that:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-white font-medium">
                <li>Splits exact coin amounts from your primary gas coin.</li>
                <li>Routes the transaction directly to AMM package targets (like Cetus or Turbos).</li>
                <li>Passes TypeArguments automatically resolved by the LLM.</li>
                <li>Executes with guaranteed atomicity (it all succeeds or entirely reverts).</li>
              </ul>
              <p>
                To provide transparency, SuiGuard features a <strong>Dual-Mode UI</strong>. Beginners see a beautifully summarized "Story Card" of what will happen, while Experts can view the raw, serialized JSON of the exact PTB payload about to be executed.
              </p>
            </div>
          </div>
        </section>
        
        {/* ─── CTA ─── */}
        <div className="text-center py-24 border-t border-[#30363d]/30">
          <h2 className="text-4xl font-extrabold text-white mb-8">Ready to experience the Agentic Web?</h2>
          <button 
            onClick={onLaunch}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-[#6fbcf0] to-[#5ba3d9] text-[#0d1117] font-extrabold text-xl hover:shadow-[0_0_40px_rgba(111,188,240,0.4)] transition-all hover:-translate-y-1"
          >
            Launch SuiGuard Engine
          </button>
        </div>

      </main>
    </div>
  );
}
