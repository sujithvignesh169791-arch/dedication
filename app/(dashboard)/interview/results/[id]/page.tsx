import { notFound } from "next/navigation"
import connectDB from "@/db/connect"
import { InterviewSession } from "@/models/InterviewSession"
import { InterviewAnswer } from "@/models/InterviewAnswer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScoreGauge } from "@/components/ScoreGauge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { KeywordChip } from "@/components/KeywordChip"
import { InterviewCharts } from "./InterviewCharts"

async function getInterviewResults(id: string) {
  await connectDB()
  const session = await InterviewSession.findById(id).lean()
  if (!session) return null
  
  const answers = await InterviewAnswer.find({ sessionId: id }).sort({ answeredAt: 1 }).lean()
  return { session, answers }
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getInterviewResults(id)
  
  if (!data) notFound()
  
  const { session, answers } = data

  const getGrade = (score: number) => score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
  const sessionGrade = getGrade(session.totalScore || 0)

  // Calculate average by category for radar chart
  const categoryScores: Record<string, { total: number, count: number }> = {}
  answers.forEach((ans: any) => {
    if (!categoryScores[ans.category]) categoryScores[ans.category] = { total: 0, count: 0 }
    categoryScores[ans.category].total += ans.score
    categoryScores[ans.category].count += 1
  })
  
  const chartData = Object.keys(categoryScores).map(cat => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    score: Math.round(categoryScores[cat].total / categoryScores[cat].count),
    fullMark: 100
  }))

  const barChartData = answers.map((ans: any, i: number) => ({
    name: `Q${i + 1}`,
    score: ans.score,
    category: ans.category
  }))

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Results</h1>
          <p className="text-muted-foreground mt-1">Role: <span className="font-semibold text-foreground">{session.targetRole}</span> • Difficulty: <span className="capitalize">{session.difficulty}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1 flex flex-col items-center justify-center p-6 border-primary/20">
          <h3 className="font-semibold text-muted-foreground mb-4">Overall Score</h3>
          <ScoreGauge score={session.totalScore || 0} grade={sessionGrade} size={160} />
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <InterviewCharts radarData={chartData} barData={barChartData} />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Question Breakdown</h2>
      
      <Accordion className="w-full space-y-4">
        {answers.map((ans: any, i: number) => (
          <AccordionItem value={`item-${i}`} key={ans._id} className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left w-full pr-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full font-bold text-white ${
                    ans.score >= 80 ? 'bg-green-500' : ans.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`}>
                    {ans.score}
                  </div>
                  <Badge variant="outline" className="capitalize whitespace-nowrap">{ans.category}</Badge>
                </div>
                <span className="font-medium line-clamp-2 flex-1">{ans.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 border-t mt-2">
              <div className="space-y-6 pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Answer</h4>
                  <div className="bg-muted p-4 rounded-md text-sm border-l-4 border-muted-foreground/30 whitespace-pre-wrap">
                    {ans.userAnswer}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Feedback</h4>
                    <p className="text-sm">{ans.feedback}</p>
                    
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Tone</h4>
                    <Badge className="capitalize">{ans.toneAnalysis}</Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Missed Points</h4>
                    <div className="flex flex-wrap">
                      {ans.missedPoints?.map((pt: string, idx: number) => (
                         <KeywordChip key={idx} label={pt} className="bg-red-100 text-red-800" />
                      ))}
                    </div>

                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Actionable Tip</h4>
                    <p className="text-sm text-primary font-medium">{ans.improvementTip}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ideal Answer Framework</h4>
                  <div className="bg-primary/5 p-4 rounded-md text-sm italic">
                    {ans.idealAnswer}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
