"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
  Loader2, PlayCircle, Clock, CheckCircle, Mic, AlertCircle, 
  Settings, Volume2, FastForward, RotateCcw 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FeedbackPanel } from "@/components/FeedbackPanel"
import { ScoreGauge } from "@/components/ScoreGauge"
import { MicButton } from "@/components/MicButton"
import { VoiceWaveform } from "@/components/VoiceWaveform"

type VoiceState = 'setup' | 'generating' | 'speaking-question' | 'listening' | 'processing' | 'showing-feedback' | 'completed'

export default function VoiceInterviewClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [resumes, setResumes] = useState<any[]>([])
  const [selectedResume, setSelectedResume] = useState<string>(searchParams.get("resumeId") || "")
  const [targetRole, setTargetRole] = useState<string>(searchParams.get("role") || "")
  const [difficulty, setDifficulty] = useState<string>("medium")
  const [questionCount, setQuestionCount] = useState<number>(5)

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [speechRate, setSpeechRate] = useState<number>(1)
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null)
  const [browserSupported, setBrowserSupported] = useState<boolean>(true)
  const [isRecording, setIsRecording] = useState(false)

  const [state, setState] = useState<VoiceState>('setup')
  const [sessionId, setSessionId] = useState<string>("")
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [timeSpent, setTimeSpent] = useState(0)
  const [sessionTotalScore, setSessionTotalScore] = useState(0)
  const [scoreData, setScoreData] = useState<any>(null)

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition || !window.speechSynthesis || !navigator.mediaDevices?.getUserMedia) {
      setBrowserSupported(false)
      return
    }

    synthRef.current = window.speechSynthesis
    
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
      if (availableVoices.length > 0 && !selectedVoice) {
        const enVoice = availableVoices.find(v => v.lang.startsWith('en-') && !v.localService) || availableVoices[0]
        setSelectedVoice(enVoice.name)
      }
    }
    
    loadVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      recognition.onresult = (event: any) => {
        let finalStr = ''
        let interimStr = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalStr += event.results[i][0].transcript
          else interimStr += event.results[i][0].transcript
        }
        if (finalStr) setTranscript(prev => prev + (prev ? ' ' : '') + finalStr.trim())
        setInterimTranscript(interimStr)
        
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = setTimeout(() => stopListening(), 3000)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        if (event.error === 'not-allowed') setHasMicPermission(false)
        setIsRecording(false)
      }
      
      recognition.onend = () => setIsRecording(false)
      recognitionRef.current = recognition
    } catch (e) {
      setBrowserSupported(false)
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setHasMicPermission(true)
        streamRef.current = stream
      })
      .catch(() => setHasMicPermission(false))

    if (session) {
      fetch('/api/resume/list')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setResumes(data.resumes)
            if (!selectedResume && data.resumes.length > 0) setSelectedResume(data.resumes[0]._id)
          }
        })
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel()
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch(e){}
      }
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [session])

  useEffect(() => {
    if (state === 'listening') {
      timerRef.current = setInterval(() => setTimeSpent(prev => prev + 1), 1000)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => stopListening(), 5000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    }
  }, [state])

  useEffect(() => {
    if (state === 'speaking-question' && questions[currentIdx]) {
      speak(questions[currentIdx].question, () => startListening())
    }
  }, [state, currentIdx])

  const speak = (text: string, onEnd?: () => void) => {
    if (!synthRef.current) return
    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    if (selectedVoice) {
      const voice = voices.find(v => v.name === selectedVoice)
      if (voice) utterance.voice = voice
    }
    utterance.rate = speechRate
    utterance.onend = () => { if (onEnd) onEnd() }
    utterance.onerror = () => { if (onEnd) onEnd() }
    synthRef.current.speak(utterance)
  }

  const startListening = () => {
    if (!recognitionRef.current) return
    setState('listening')
    setTranscript('')
    setInterimTranscript('')
    try {
      recognitionRef.current.start()
      setIsRecording(true)
    } catch(e) {}
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        setIsRecording(false)
      } catch(e){}
    }
  }

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
        body: JSON.stringify({ resumeId: selectedResume, targetRole, difficulty, questionCount })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSessionId(data.sessionId)
      setQuestions(data.questions)
      setCurrentIdx(0)
      setState('speaking-question')
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      setState('setup')
    }
  }

  const handleSubmitAnswer = async () => {
    const finalAnswer = transcript + (interimTranscript ? ' ' + interimTranscript : '')
    if (finalAnswer.length < 20) {
      toast({ title: 'Too short', description: 'Please provide a longer answer.' })
      return
    }
    setState('processing')
    stopListening()
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
          answer: finalAnswer,
          timeSpentSeconds: timeSpent,
          resumeContext: resumes.find(r => r._id === selectedResume)?.extractedText || "",
          voiceMode: true 
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setScoreData(data.score)
      setSessionTotalScore(data.totalScore)
      setState('showing-feedback')
      speak(`Grade ${data.score.grade}. ${data.score.feedback}`)
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      setState('listening')
    }
  }

  const handleNext = () => {
    if (synthRef.current) synthRef.current.cancel()
    setTranscript("")
    setInterimTranscript("")
    setTimeSpent(0)
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1)
      setState('speaking-question')
    } else {
      setState('completed')
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && state === 'showing-feedback') {
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state, currentIdx, questions.length])

  if (!browserSupported) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Browser Not Supported</h2>
        <p className="text-muted-foreground">Your browser does not support the necessary Web Speech APIs for the voice interview.</p>
        <Button onClick={() => router.push('/interview')}>Switch to Text Interview</Button>
      </div>
    )
  }

  if (state === 'setup') {
    return (
      <div className="container mx-auto max-w-xl py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mic className="h-6 w-6 text-primary" /> Voice Interview Setup</CardTitle>
            <CardDescription>Practice speaking your answers aloud with real-time feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {hasMicPermission === false && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-start gap-3 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <strong>Microphone Access Denied.</strong>
                  <p>Please allow microphone access in your browser settings and refresh the page.</p>
                </div>
              </div>
            )}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Questions: {questionCount}</Label>
                <Slider value={[questionCount]} onValueChange={val => setQuestionCount(Array.isArray(val) ? val[0] : val as number)} min={3} max={10} step={1} className="pt-2" />
              </div>
            </div>
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-medium flex items-center gap-2"><Settings className="h-4 w-4" /> Voice Settings</h3>
              <div className="space-y-2">
                <Label>Interviewer Voice</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger><SelectValue placeholder="Select Voice" /></SelectTrigger>
                  <SelectContent>
                    {voices.filter(v => v.lang.startsWith('en')).map(v => (
                      <SelectItem key={v.name} value={v.name}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Speech Rate</Label>
                  <span className="text-xs text-muted-foreground">{(speechRate || 1).toFixed(1)}x</span>
                </div>
                <Slider value={[speechRate || 1]} onValueChange={val => setSpeechRate(Array.isArray(val) ? val[0] : val as number)} min={0.5} max={1.5} step={0.1} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleStart} disabled={!targetRole || !selectedResume || hasMicPermission === false}>
              <PlayCircle className="mr-2 h-4 w-4" /> Start Voice Interview
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
      </div>
    )
  }

  if (state === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-bold">Evaluating your answer...</h2>
      </div>
    )
  }

  if (state === 'speaking-question' && questions[currentIdx]) {
    const q = questions[currentIdx]
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4 flex flex-col items-center justify-center min-h-[70vh]">
        <Badge variant="outline" className="mb-8 uppercase tracking-wider">{q.category}</Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 leading-tight">
          "{q.question}"
        </h2>
        <VoiceWaveform isActive={true} className="mb-12" />
        <div className="text-muted-foreground mb-8 animate-pulse">AI is speaking...</div>
        <Button variant="outline" onClick={() => {
          if (synthRef.current) synthRef.current.cancel()
          startListening()
        }}>
          <FastForward className="mr-2 h-4 w-4" /> Skip reading
        </Button>
      </div>
    )
  }

  if (state === 'listening' && questions[currentIdx]) {
    const q = questions[currentIdx]
    const currentFullText = transcript + (interimTranscript ? ' ' + interimTranscript : '')
    
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <div className="mb-6 flex justify-between items-center text-muted-foreground">
          <Badge variant="secondary" className="uppercase">{q.category}</Badge>
          <div className="flex items-center gap-1 font-mono">
            <Clock className="h-4 w-4" /> {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <Card className="border-primary/20 shadow-lg mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">{q.question}</h3>
          </CardContent>
        </Card>
        <div className="flex flex-col items-center mb-8">
          <MicButton 
            isListening={isRecording}
            onClick={() => isRecording ? stopListening() : startListening()}
          />
          <span className="mt-4 text-sm text-red-500 font-medium">{isRecording ? 'Recording...' : 'Paused'}</span>
        </div>
        <div className="space-y-4">
          <Label>Your Transcript</Label>
          <Textarea 
            className="min-h-[150px] text-base"
            value={currentFullText}
            onChange={(e) => {
              setTranscript(e.target.value)
              setInterimTranscript("")
            }}
            placeholder="Speak now..."
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{currentFullText.split(' ').filter(x => x).length} words</span>
            <div className="space-x-2">
              <Button variant="ghost" size="sm" onClick={() => {
                setTranscript("")
                setInterimTranscript("")
                startListening()
              }}>
                <RotateCcw className="mr-2 h-4 w-4" /> Clear & Retry
              </Button>
              {isRecording && (
                <Button variant="outline" size="sm" onClick={stopListening}>
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <Button size="lg" onClick={handleSubmitAnswer} disabled={currentFullText.length < 20}>
            Submit Answer
          </Button>
        </div>
      </div>
    )
  }

  if (state === 'showing-feedback') {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => speak(scoreData.idealAnswer)}>
            <Volume2 className="mr-2 h-4 w-4" /> Hear Ideal Answer
          </Button>
          <span className="text-sm">Session Avg: <strong className="text-primary">{sessionTotalScore}</strong></span>
        </div>
        <FeedbackPanel scoreData={scoreData} onNext={handleNext} isLast={currentIdx === questions.length - 1} />
        <p className="text-center text-muted-foreground mt-4 text-sm">Press Space to continue</p>
      </div>
    )
  }

  if (state === 'completed') {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4 text-center space-y-8 animate-in fade-in duration-700">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-full mb-4">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold">Voice Interview Completed!</h1>
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
