import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Briefcase, Award, Mic } from "lucide-react"

import connectDB from "@/db/connect"
import { ResumeAnalysis } from "@/models/ResumeAnalysis"
import { Resume } from "@/models/Resume"
import { ScoreGauge } from "@/components/ScoreGauge"
import { SectionScoreBar } from "@/components/SectionScoreBar"
import { KeywordChip } from "@/components/KeywordChip"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

async function getAnalysisData(id: string) {
  console.log("🔍 [AnalysisPage] Fetching data for id:", id);
  await connectDB()
  let analysis = await ResumeAnalysis.findById(id).lean().catch((e) => {
    console.error("❌ findById error:", e);
    return null;
  })
  
  if (!analysis) {
    console.log("⚠️ Not found by ID, trying by resumeId");
    analysis = await ResumeAnalysis.findOne({ resumeId: id }).sort({ createdAt: -1 }).lean().catch((e) => {
      console.error("❌ findOne error:", e);
      return null;
    })
  }

  console.log("🔍 [AnalysisPage] Analysis found:", !!analysis);
  if (!analysis) return null
  
  const resume = await Resume.findById(analysis.resumeId).lean()
  return { analysis, resume }
}

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getAnalysisData(id)
  
  if (!data) {
    notFound()
  }

  const { analysis, resume } = data

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
          <p className="text-muted-foreground mt-1">
            For {resume?.fileName} • Target Role: <span className="font-semibold text-foreground">{analysis.targetRole}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" render={<Link href={`/resume/upload`} />}>
               <RefreshCw className="mr-2 h-4 w-4" />
               Re-analyze
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle>ATS Compatibility</CardTitle>
              <CardDescription>Overall Score</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
              <ScoreGauge score={analysis.score} grade={analysis.grade} />
              
              <div className="w-full mt-8 space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Section Breakdown</h3>
                <SectionScoreBar label="Summary" score={analysis.sectionBreakdown.summary} />
                <SectionScoreBar label="Experience" score={analysis.sectionBreakdown.experience} />
                <SectionScoreBar label="Skills" score={analysis.sectionBreakdown.skills} />
                <SectionScoreBar label="Education" score={analysis.sectionBreakdown.education} />
                <SectionScoreBar label="Formatting" score={analysis.sectionBreakdown.formatting} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Career Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground block mb-1">Estimated Level</span>
                <Badge variant="outline" className="capitalize text-sm px-3 py-1 bg-primary/5">
                  {analysis.estimatedExperienceLevel}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block mb-2">Recommended Roles</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendedJobTitles.map((title: string, i: number) => (
                    <Badge key={i} variant="secondary">{title}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-100 dark:border-green-900/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-100 dark:border-red-900/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                  <XCircle className="h-5 w-5" />
                  Key Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Keywords & Skills Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  Missing Keywords (Add These)
                </h4>
                <div className="flex flex-wrap">
                  {analysis.missingKeywords.length > 0 ? (
                    analysis.missingKeywords.map((kw: string, i: number) => (
                      <KeywordChip key={i} label={kw} className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300" />
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None found. Great job!</span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  Skill Gaps to Address
                </h4>
                <div className="flex flex-wrap">
                  {analysis.skillGaps.length > 0 ? (
                    analysis.skillGaps.map((skill: string, i: number) => (
                      <KeywordChip key={i} label={skill} className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300" />
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None found.</span>
                  )}
                </div>
              </div>

              {analysis.formattingIssues.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-red-600 dark:text-red-400">
                    Formatting Issues
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
                    {analysis.formattingIssues.map((issue: string, i: number) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FULL WIDTH BOTTOM SECTION */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Improvement Roadmap
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.improvementPlan.map((step: any, i: number) => (
            <Card key={i} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-background">Step {step.step}</Badge>
                  <Badge 
                    variant={step.impact === 'high' ? 'default' : step.impact === 'medium' ? 'secondary' : 'outline'}
                    className={step.impact === 'high' ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    {step.impact} Impact
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-3">{step.action}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  ⏱️ Estimate: {step.timeEstimate}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t">
          <Button size="lg" className="flex-1" render={<Link href={`/interview?resumeId=${analysis.resumeId}&role=${encodeURIComponent(analysis.targetRole)}`} />}>
              Start AI Interview
              <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="secondary" className="flex-1" render={<Link href={`/interview/voice?resumeId=${analysis.resumeId}&role=${encodeURIComponent(analysis.targetRole)}`} />}>
              <Mic className="mr-2 h-5 w-5" />
              Start Voice Interview
          </Button>
          <Button size="lg" variant="outline" className="flex-1" render={<Link href={`/resume/rebuilder/${analysis.resumeId}`} />}>
              Rebuild My Resume (Pro)
          </Button>
        </div>
      </div>
    </div>
  )
}
