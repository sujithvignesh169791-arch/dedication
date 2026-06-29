"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X, CheckCircle2, FileText, Mic, Star } from "lucide-react";
import { useState } from "react";
import { VideoBackground } from "@/components/VideoBackground";

export default function CodeNestLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#070b0a] text-white selection:bg-[#5ed29c]/30">
      <VideoBackground />

      {/* Global Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          {/* Minimalist Logo */}
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-[#070b0a] rounded-sm" />
          </div>
          <span className="font-['var(--font-inter)'] font-bold tracking-tight text-xl">MOCK INTERVIEW-AI POWERED</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 font-['var(--font-inter)'] text-[16px] font-medium">
          {["PROJECTS", "BLOG", "ABOUT", "RESUME"].map((item) => (
            <Link key={item} href="#" className="hover:text-[#5ed29c] transition-colors">
              {item}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#070b0a] flex flex-col items-center justify-center">
          <nav className="flex flex-col items-center gap-8 font-['var(--font-inter)'] text-2xl font-medium">
            {["PROJECTS", "BLOG", "ABOUT", "RESUME"].map((item) => (
              <Link
                key={item}
                href="#"
                className="hover:text-[#5ed29c] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Hero Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 text-center mt-20">
        
        {/* Central Glow (SVG Ellipse) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] pointer-events-none">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto opacity-40">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="25" result="blur" />
              </filter>
            </defs>
            <ellipse cx="50" cy="50" rx="40" ry="20" fill="#0b3b2c" filter="url(#glow)" />
            <ellipse cx="50" cy="50" rx="30" ry="10" fill="#138565" filter="url(#glow)" />
          </svg>
        </div>

        {/* The Liquid Glass Card */}
        <div className="relative w-[200px] h-[200px] rounded-2xl flex flex-col items-center justify-center p-4 -translate-y-[50px] mb-8"
             style={{
               background: "rgba(255, 255, 255, 0.01)",
               backgroundBlendMode: "luminosity",
               backdropFilter: "blur(4px)",
               WebkitBackdropFilter: "blur(4px)",
               boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1)"
             }}>
          {/* Border Effect via ::before pseudo-element inline technique */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
               style={{
                 padding: "1.4px",
                 background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                 WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                 WebkitMaskComposite: "xor",
                 maskComposite: "exclude"
               }} 
          />
          <div className="relative z-10 w-full h-full p-1 flex items-center justify-center">
            <Image 
              src="/images/advanced_3d_ai.png" 
              alt="Advanced 3D AI Core" 
              width={180} 
              height={180} 
              className="object-cover rounded-xl w-full h-full opacity-90" 
            />
          </div>
        </div>

        {/* Eyebrow */}
        <div className="font-['var(--font-plus-jakarta-sans)'] font-bold text-[11px] uppercase tracking-widest text-[#5ed29c] mb-6">
          Career-Ready Curriculum
        </div>

        {/* Main Headline with 3D Effect */}
        <h1 
          className="font-['var(--font-inter)'] font-extrabold uppercase tracking-tight text-[36px] md:text-[60px] leading-[1.1] mb-6 max-w-5xl text-transparent bg-clip-text bg-gradient-to-b from-white to-[#a9e5ca]"
          style={{
            textShadow: "0px 1px 0px #2b6a4b, 0px 2px 0px #24573e, 0px 3px 0px #1d4531, 0px 4px 0px #153224, 0px 10px 20px rgba(0,0,0,0.9), 0px 0px 15px rgba(94, 210, 156, 0.3)"
          }}
        >
          ANALYSIS AND IMPROVE YOUR <br className="hidden md:block" /> RESUME AND SKILLS
        </h1>

        {/* Description */}
        <p className="font-['var(--font-inter)'] text-[16px] text-white/70 max-w-[600px] leading-relaxed mb-10">
          Upload your resume for instant AI-powered feedback, actionable improvements, and practice with realistic mock interviews to land your dream job.
        </p>

        {/* Primary CTA */}
        <Link href="/signup">
          <button className="flex items-center gap-2 bg-[#5ed29c] text-[#070b0a] font-['var(--font-inter)'] font-bold uppercase tracking-wide text-sm px-8 py-4 rounded-full hover:bg-[#4bc089] transition-all hover:scale-105 active:scale-95">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-black/40 backdrop-blur-md py-24 border-y border-white/10 mt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Everything you need to get hired</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#070b0a]/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-sm flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-[#5ed29c]/10 text-[#5ed29c] rounded-2xl flex items-center justify-center mb-6">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">ATS Resume Analysis</h3>
              <p className="text-white/70">
                Get instant feedback on your resume. We identify missing keywords, formatting issues, and calculate your ATS match score.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#070b0a]/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-sm flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-[#5ed29c]/10 text-[#5ed29c] rounded-2xl flex items-center justify-center mb-6">
                <Mic className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Mock Interviews</h3>
              <p className="text-white/70">
                Practice with our voice-enabled AI interviewer. Get real-time feedback on your answers, tone, and confidence.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#070b0a]/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg tracking-wider">
                Pro
              </div>
              <div className="h-16 w-16 bg-[#5ed29c]/10 text-[#5ed29c] rounded-2xl flex items-center justify-center mb-6">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Auto-Rebuilder</h3>
              <p className="text-white/70">
                Let AI automatically rewrite your bullet points and summary to perfectly match the job description and beat the ATS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="relative z-10 container mx-auto px-4 py-24 text-center max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-white">Stop guessing what recruiters want.</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-left">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-[#5ed29c] h-6 w-6" />
            <span className="text-lg font-medium text-white/90">Bypass ATS filters</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-[#5ed29c] h-6 w-6" />
            <span className="text-lg font-medium text-white/90">Nail technical questions</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-[#5ed29c] h-6 w-6" />
            <span className="text-lg font-medium text-white/90">Negotiate higher salaries</span>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-white/10 py-12 text-center text-white/50">
        <p>© {new Date().getFullYear()} AI Resume Pro Coach. All rights reserved.</p>
      </footer>
    </div>
  );
}
