import Link from "next/link";
import { ArrowRight, Shield, Lock, Activity } from "lucide-react";

export default function NexusLanding() {
  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-white/20 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tighter text-xl">NEXUS<span className="text-white/40 font-normal text-sm ml-1">v2.4</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div>
            <Link href="/login" className="text-sm font-medium hover:text-white text-white/70 mr-6 transition-colors hidden md:inline-block">Log in</Link>
            <Link href="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded hover:bg-white/90 transition-colors">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          System Operational
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl leading-[1.1] mb-6">
          Get hired by the algorithm,<br className="hidden md:block"/> hired by the human.
        </h1>
        
        <p className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
          Nexus is a diagnostic AI for your career. Score your resume against any ATS, rehearse interviews with an adaptive voice agent, and rebuild your story for the role you want — in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/signup" className="w-full sm:w-auto bg-white text-black font-semibold px-8 py-4 rounded hover:bg-white/90 transition-all flex items-center justify-center gap-2 group">
            Analyze my resume
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/signup" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white font-medium px-8 py-4 rounded hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            Try a mock interview
          </Link>
        </div>

        {/* Floating Quote */}
        <div className="mt-20 p-6 border border-white/10 bg-white/5 rounded-xl backdrop-blur-sm max-w-md w-full relative text-left">
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <span className="text-[10px] font-bold text-white">AI</span>
          </div>
          <p className="text-sm font-medium text-white/80 italic">
            "Tell me about a time you led through ambiguity."
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">One engine. Three weapons against the void.</h2>
            <p className="text-white/50">Built around the actual moments your application either wins or dies.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Link href="/signup" className="group p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex flex-col h-full cursor-pointer">
              <div className="text-xs font-mono text-white/40 mb-8">/ 01</div>
              <h3 className="text-xl font-bold mb-4">ATS Resume Analysis</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8 flex-1">
                Radiographic scan against the JD. Score, keyword gaps, formatting traps, line-by-line surgery.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open module <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            {/* Feature 2 */}
            <Link href="/signup" className="group p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex flex-col h-full cursor-pointer">
              <div className="text-xs font-mono text-white/40 mb-8">/ 02</div>
              <h3 className="text-xl font-bold mb-4">AI Mock Interviews</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8 flex-1">
                Adaptive voice agent for behavioral & technical. STAR scoring, filler detection, real coaching.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open module <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            {/* Feature 3 */}
            <Link href="/signup" className="group p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex flex-col h-full cursor-pointer">
              <div className="text-xs font-mono text-white/40 mb-8">/ 03</div>
              <h3 className="text-xl font-bold mb-4">Auto-Rebuilder</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8 flex-1">
                One-click rewrite tuned to your target role. Diff-view, accept-per-line, export anywhere.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open module <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 rounded border border-white/10 flex items-center justify-center mb-6 bg-white/5">
                <span className="font-mono text-sm">01</span>
              </div>
              <h4 className="font-bold mb-2">Drop your resume</h4>
              <p className="text-sm text-white/50">PDF, DOCX, or paste. We parse the structure your ATS sees.</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded border border-white/10 flex items-center justify-center mb-6 bg-white/5">
                <span className="font-mono text-sm">02</span>
              </div>
              <h4 className="font-bold mb-2">We diagnose everything</h4>
              <p className="text-sm text-white/50">Score, gaps, weak verbs, missing metrics — across 47 signals.</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded border border-white/10 flex items-center justify-center mb-6 bg-white/5 text-emerald-400 border-emerald-400/20 bg-emerald-400/5">
                <span className="font-mono text-sm">03</span>
              </div>
              <h4 className="font-bold mb-2">Ship a stronger you</h4>
              <p className="text-sm text-white/50">Auto-rebuild, drill the interview, export the winning version.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} NEXUS Systems.
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors"><Shield className="w-3 h-3"/> Security</a>
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors"><Lock className="w-3 h-3"/> Privacy</a>
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors"><Activity className="w-3 h-3"/> Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
