import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { ArrowRight, CheckCircle2, FileText, Mic, Star } from "lucide-react"
import { VantaBackground } from "@/components/VantaBackground"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <VantaBackground />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-24 pb-32 text-center max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Land Your Dream Job with AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            AI Resume Pro Coach analyzes your resume, scores it against ATS algorithms, and trains you with dynamic, role-specific mock interviews.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full">
                Already have an account?
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 bg-background/60 backdrop-blur-xl py-24 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Everything you need to get hired</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">ATS Resume Analysis</h3>
                <p className="text-muted-foreground">
                  Get instant feedback on your resume. We identify missing keywords, formatting issues, and calculate your ATS match score.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Mic className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Mock Interviews</h3>
                <p className="text-muted-foreground">
                  Practice with our voice-enabled AI interviewer. Get real-time feedback on your answers, tone, and confidence.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg tracking-wider">
                  Pro
                </div>
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Auto-Rebuilder</h3>
                <p className="text-muted-foreground">
                  Let AI automatically rewrite your bullet points and summary to perfectly match the job description and beat the ATS.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Trust */}
        <section className="relative z-10 container mx-auto px-4 py-24 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Stop guessing what recruiters want.</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500 h-6 w-6" />
              <span className="text-lg font-medium">Bypass ATS filters</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500 h-6 w-6" />
              <span className="text-lg font-medium">Nail technical questions</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500 h-6 w-6" />
              <span className="text-lg font-medium">Negotiate higher salaries</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 bg-background/60 backdrop-blur-xl border-t border-border/50 py-12 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Resume Pro Coach. All rights reserved.</p>
      </footer>
    </div>
  )
}
