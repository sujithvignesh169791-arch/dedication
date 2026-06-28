"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2, PlayCircle, Clock, CheckCircle, Mic } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { FeedbackPanel } from "@/components/FeedbackPanel"
import { ScoreGauge } from "@/components/ScoreGauge"

type InterviewState = 'setup' | 'generating' | 'in-progress' | 'scoring' | 'between-questions' | 'completed'

function InterviewFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [resumes, setResumes] = useState<any[]>([])
  const [selectedResume, setSelectedResume] = useState<string>(searchParams.get("resumeId") || "")
  const [targetRole, setTargetRole] = useState<string>(searchParams.get("role") || "")
  const [difficulty, setDifficulty] = useState<string>("medium")
  const [questionCount, setQuestionCount] = useState<number>(10)

  const [state, setState] = useState<InterviewState>('setup')
  const [sessionId, setSessionId] = useState<string>("")
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  
  // Active Question State
  const [answer, setAnswer] = useState("")
  const [timeSpent, setTimeSpent] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Scoring State
  const [scoreData, setScoreData] = useState<any>(null)
  const [sessionTotalScore, setSessionTotalScore] = useState(0)

  const questionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state === 'in-progress' && questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [state, currentIdx])

  useEffect(() => {
    if (session) {
      fetch('/api/resume/list')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setResumes(data.resumes)
            if (!selectedResume && data.resumes.length > 0) {
              setSelectedResume(data.resumes[0]._id)
            }
          }
        })
    }
  }, [session])

  useEffect(() => {
    if (state === 'in-progress') {
      setTimeSpent(0)
      timerRef.current = setInterval(() => setTimeSpent(prev => prev + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [state])

  const handleStart = async () => {
    if (!selectedResume || !targetRole) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please select a resume and enter a target role.' })
      return
    }

    setState('generating')
    try {
      const res = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: selectedResume,
          targetRole,
          difficulty,
          questionCount
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setSessionId(data.sessionId)
      setQuestions(data.questions)
      setCurrentIdx(0)
      setState('in-progress')
      
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      setState('setup')
    }
  }

  const handleSubmitAnswer = async () => {
    if (answer.length < 50) return
    
    setState('scoring')
    try {
      const q = questions[currentIdx]
      const res = await fetch('/api/interview/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: q.id,
          question: q.question,
          category: q.category,
          answer,
          timeSpentSeconds: timeSpent,
          resumeContext: resumes.find(r => r._id === selectedResume)?.extractedText || ""
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setScoreData(data.score)
      setSessionTotalScore(data.totalScore)
      
      setState('between-questions')
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      setState('in-progress')
    }
  }

  const handleNext = () => {
    setAnswer("")
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1)
      setState('in-progress')
    } else {
      setState('completed')
    }
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (state === 'setup') {
    return (
      <div className="container mx-auto max-w-xl py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Mock Interview Setup</CardTitle>
            <CardDescription>Configure your AI-powered interview session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Target Role</Label>
              <Input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div className="space-y-2">
              <Label>Select Resume</Label>
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger><SelectValue placeholder="Select a resume" /></SelectTrigger>
                <SelectContent>
                  {resumes.map(r => (
                    <SelectItem key={r._id} value={r._id}>{r.fileName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (Intern / Entry Level)</SelectItem>
                  <SelectItem value="medium">Medium (Mid-level)</SelectItem>
                  <SelectItem value="hard">Hard (Senior / Lead)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Number of Questions</Label>
                <span className="text-sm font-medium">{questionCount}</span>
              </div>
              <Slider value={[questionCount]} onValueChange={val => setQuestionCount(Array.isArray(val) ? val[0] : val as number)} min={5} max={15} step={1} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" onClick={handleStart} disabled={!targetRole || !selectedResume}>
              <PlayCircle className="mr-2 h-4 w-4" /> Start Text Interview
            </Button>
            <Button variant="secondary" className="w-full" render={<Link href={`/interview/voice?resumeId=${selectedResume}&role=${encodeURIComponent(targetRole)}`} />}>
              <Mic className="mr-2 h-4 w-4" /> Switch to Voice Interview
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (state === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-bold">Generating Interview...</h2>
        <p className="text-muted-foreground">The AI is analyzing your resume to create tailored questions.</p>
      </div>
    )
  }

  if (state === 'scoring') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-bold">Evaluating Answer...</h2>
        <p className="text-muted-foreground">The AI is analyzing your response.</p>
      </div>
    )
  }

  if (state === 'in-progress' && questions[currentIdx]) {
    const q = questions[currentIdx]
    return (
      <div ref={questionRef} className="container mx-auto max-w-3xl py-12 px-4 scroll-mt-20">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="flex items-center text-muted-foreground gap-1 bg-muted px-3 py-1 rounded-full text-sm font-mono">
              <Clock className="h-4 w-4" /> {formatTime(timeSpent)}
            </div>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${((currentIdx) / questions.length) * 100}%` }} />
          </div>
        </div>

        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <Badge variant="secondary" className="capitalize">{q.category}</Badge>
              <Badge variant="outline" className="capitalize">{q.difficulty}</Badge>
            </div>
            <CardTitle className="text-2xl md:text-3xl leading-tight">
              {q.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              className="min-h-[200px] text-base resize-y p-4"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />
            <div className="flex justify-between items-center text-sm">
              <span className={answer.length < 50 ? "text-red-500" : "text-green-500"}>
                {answer.length} characters (min 50)
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button size="lg" onClick={handleSubmitAnswer} disabled={answer.length < 50}>
              Submit Answer
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (state === 'between-questions') {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <div className="mb-6 flex justify-between items-center">
          <span className="font-medium text-muted-foreground">Question {currentIdx + 1} completed</span>
          <span className="text-sm">Session Avg Score: <strong className="text-primary">{sessionTotalScore}</strong></span>
        </div>
        <FeedbackPanel scoreData={scoreData} onNext={handleNext} isLast={currentIdx === questions.length - 1} />
      </div>
    )
  }

  if (state === 'completed') {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4 text-center space-y-8 animate-in fade-in duration-700">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-full mb-4">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold">Interview Completed!</h1>
        
        <Card className="mt-8 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">Overall Session Score</h3>
            <div className="flex justify-center mb-6">
              <ScoreGauge score={sessionTotalScore} grade={sessionTotalScore >= 90 ? 'A' : sessionTotalScore >= 80 ? 'B' : sessionTotalScore >= 70 ? 'C' : 'D'} />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button size="lg" render={<a href={`/interview/results/${sessionId}`} />}>
            View Full Results
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.location.reload()}>
            Practice Again
          </Button>
        </div>
      </div>
    )
  }

  return null
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <InterviewFlow />
    </Suspense>
  )
}
