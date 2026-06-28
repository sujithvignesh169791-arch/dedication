"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { UploadCloud, FileText, X, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type State = 'idle' | 'file-selected' | 'uploading' | 'success' | 'error'

export default function ResumeUploadPage() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [state, setState] = useState<State>('idle')
  const [progress, setProgress] = useState(0)
  const [targetRole, setTargetRole] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  
  const { register, watch, setValue, resetField } = useForm<{ file: FileList }>()
  const fileList = watch("file")
  const file = fileList && fileList.length > 0 ? fileList[0] : null

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }, [])

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(selectedFile.type)) {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please upload a PDF or DOCX file.' })
      return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File Too Large', description: 'Max file size is 5MB.' })
      return
    }
    // Set file manually in react-hook-form
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(selectedFile)
    setValue("file", dataTransfer.files)
    setState('file-selected')
  }

  const removeFile = () => {
    resetField("file")
    setState('idle')
  }

  const uploadFile = async () => {
    if (!file) return
    if (!targetRole.trim()) {
      toast({ variant: 'destructive', title: 'Missing Role', description: 'Please enter a target role.' })
      return
    }
    setState('uploading')
    setProgress(10)

    const formData = new FormData()
    formData.append('file', file)

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 10))
    }, 500)

    try {
      // 1. Upload Resume
      const uploadRes = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      })
      const uploadData = await uploadRes.json()
      
      if (!uploadRes.ok) {
        throw new Error(uploadData.message || 'Upload failed')
      }
      
      setProgress(50)

      // 2. Analyze Resume
      const analyzeRes = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: uploadData.resumeId, targetRole: targetRole.trim() }),
      })
      const analyzeData = await analyzeRes.json()

      clearInterval(progressInterval)

      if (!analyzeRes.ok) {
        throw new Error(analyzeData.message || 'Analysis failed')
      }

      setProgress(100)
      setState('success')
      
      toast({
        title: 'Analysis Complete',
        description: 'Your resume has been successfully analyzed.',
      })

      setTimeout(() => {
        router.push(`/resume/analysis/${analyzeData.analysisId}`)
      }, 1000)

    } catch (error: any) {
      clearInterval(progressInterval)
      setState('error')
      setProgress(0)
      toast({
        variant: 'destructive',
        title: 'Process Failed',
        description: error.message,
      })
    }
  }

  // Register input with react-hook-form but handle onChange to hook into our validation
  const { ref, onChange, ...rest } = register("file")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Upload Your Resume</CardTitle>
          <CardDescription>Upload your resume to get instant AI-powered feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          {state === 'idle' || state === 'error' ? (
            <div
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer min-h-[44px]"
              onDragOver={isTouchDevice ? undefined : handleDragOver}
              onDrop={isTouchDevice ? undefined : handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drag your resume here or click to browse</h3>
              <p className="text-sm text-muted-foreground mb-4">Support for PDF and DOCX files.</p>
              <Badge variant="secondary">PDF or DOCX, max 5MB</Badge>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                {...rest}
                ref={(e) => {
                  ref(e)
                  fileInputRef.current = e
                }}
                onChange={(e) => {
                  onChange(e)
                  if (e.target.files && e.target.files.length > 0) {
                    validateAndSetFile(e.target.files[0])
                  }
                }}
              />
            </div>
          ) : (
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    {state === 'success' ? <CheckCircle className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <div>
                    <h4 className="font-semibold line-clamp-1">{file?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB
                    </p>
                  </div>
                </div>
                {state === 'file-selected' && (
                  <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="mb-6 space-y-2">
                <Label htmlFor="targetRole">Target Job Role</Label>
                <Input 
                  id="targetRole"
                  placeholder="e.g. Frontend Developer, Data Scientist..." 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  disabled={state === 'uploading' || state === 'success'}
                />
              </div>
              
              {state === 'uploading' || state === 'success' ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{state === 'success' ? 'Upload complete!' : 'Uploading...'}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              ) : (
                <Button className="w-full" onClick={uploadFile}>
                  Upload and Analyze
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
