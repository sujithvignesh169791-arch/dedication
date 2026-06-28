"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  FileText, Download, RefreshCw, CheckCircle, 
  Lock, Star, Check 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { generateTemplate } from "@/lib/templates"

export default function ResumeRebuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [resume, setResume] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isPremium, setIsPremium] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  const [targetRole, setTargetRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern')
  
  const [rebuilding, setRebuilding] = useState(false)
  const [rebuiltResume, setRebuiltResume] = useState<any>(null)
  const [improvements, setImprovements] = useState<string[]>([])
  const [exporting, setExporting] = useState<string | null>(null)

  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      setIsPremium(!!session.user?.isPremium)
      fetchData()
    }
  }, [status, session])

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/resume/list`)
      const data = await res.json()
      const found = data.resumes.find((r: any) => r._id === id)
      if (found) setResume(found)

      const analysisRes = await fetch(`/api/resume/analyze?resumeId=${id}`)
      if (analysisRes.ok) {
        const analysisData = await analysisRes.json()
        setAnalysis(analysisData.analysis)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (rebuiltResume && iframeRef.current) {
      const html = generateTemplate(rebuiltResume, template)
      iframeRef.current.srcdoc = html
    }
  }, [rebuiltResume, template])

  const handleRebuild = async () => {
    if (!isPremium) {
      router.push('/premium')
      return
    }
    
    setRebuilding(true)
    try {
      const res = await fetch('/api/resume/rebuild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: id,
          targetRole: targetRole || "Professional",
          jobDescription,
          templateStyle: template
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error)

      setRebuiltResume(data.rebuiltResume)
      setImprovements(data.analysisImprovements)
      toast({ title: 'Success', description: 'Resume rebuilt successfully!' })
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      if (error.message === 'premium_required') router.push('/premium')
    } finally {
      setRebuilding(false)
    }
  }

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!rebuiltResume) return
    setExporting(format)
    try {
      const res = await fetch('/api/resume/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeJSON: rebuiltResume, templateStyle: template, format })
      })
      if (!res.ok) throw new Error('Export failed')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Resume-${template}.${format}`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Export Failed', description: error.message })
    } finally {
      setExporting(null)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  if (!resume) return <div className="p-12 text-center text-muted-foreground">Resume not found.</div>

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl relative">
      {!isPremium && (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-32 bg-background/60 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl border-primary/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Unlock Resume Rebuilder</CardTitle>
              <CardDescription>Upgrade to Pro to instantly transform your resume.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <ul className="space-y-3">
                <li className="flex gap-2 items-center"><Check className="h-5 w-5 text-green-500" /> AI-powered ATS optimization</li>
                <li className="flex gap-2 items-center"><Check className="h-5 w-5 text-green-500" /> Professional HTML/PDF templates</li>
                <li className="flex gap-2 items-center"><Check className="h-5 w-5 text-green-500" /> Targeted to specific job descriptions</li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-6">
              <Button className="w-full" size="lg" onClick={() => router.push('/premium')}>
                Upgrade to Pro
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard')}>
                Maybe Later
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Rebuilder</h1>
          <p className="text-muted-foreground mt-1">Transform your resume for ATS systems and target roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5" /> Original Resume</CardTitle>
                {analysis && (
                  <Badge variant="outline" className={analysis.score >= 80 ? 'border-green-500 text-green-600' : 'border-amber-500 text-amber-600'}>
                    Original ATS Score: {analysis.score}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 overflow-auto bg-muted/30">
              <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                {resume.extractedText}
              </pre>
            </CardContent>
          </Card>

          {analysis && analysis.formattingIssues?.length > 0 && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-destructive">What was wrong?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-sm text-destructive/80 space-y-1">
                  {analysis.formattingIssues.map((iss: string, i: number) => <li key={i}>{iss}</li>)}
                  {analysis.skillGaps.map((iss: string, i: number) => <li key={i}>Missing skill: {iss}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2"><Star className="h-5 w-5 text-primary" /> Configuration & Rebuild</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Target Role</Label>
                <Input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Senior Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label>Job Description (Optional)</Label>
                <Textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste job description here..." className="h-20" />
              </div>
              <div className="space-y-2">
                <Label>Template Style</Label>
                <div className="flex gap-2">
                  {(['modern', 'classic', 'minimal'] as const).map(t => (
                    <Button 
                      key={t}
                      variant={template === t ? 'default' : 'outline'}
                      onClick={() => setTemplate(t)}
                      className="capitalize flex-1"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleRebuild} disabled={rebuilding || !targetRole}>
                {rebuilding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...</> : <><RefreshCw className="mr-2 h-4 w-4" /> Rebuild Resume</>}
              </Button>
            </CardContent>
          </Card>

          {rebuiltResume && (
            <Card className="flex flex-col border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExport('docx')} disabled={exporting !== null}>
                    {exporting === 'docx' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} DOCX
                  </Button>
                  <Button size="sm" onClick={() => handleExport('pdf')} disabled={exporting !== null}>
                    {exporting === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-white min-h-[600px] overflow-hidden">
                <iframe 
                  ref={iframeRef} 
                  className="w-full h-[600px] border-0" 
                  title="Resume Preview"
                  sandbox="allow-same-origin"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {rebuiltResume && improvements.length > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 mb-12">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-green-800 dark:text-green-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Optimizations Applied
              </CardTitle>
              <Badge className="bg-green-500 hover:bg-green-600">New Est. Score: 95+</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-900 dark:text-green-300">
              {improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 flex-shrink-0" /> {imp}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-end">
               <Button onClick={() => router.push(`/interview?resumeId=${id}&role=${targetRole}`)}>
                 Practice Interview with this Role
               </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
