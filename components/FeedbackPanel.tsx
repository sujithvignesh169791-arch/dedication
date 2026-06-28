import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScoreGauge } from "@/components/ScoreGauge"
import { KeywordChip } from "@/components/KeywordChip"
import { ChevronDown, ChevronUp, Lightbulb, MessageSquare } from "lucide-react"

interface FeedbackPanelProps {
  scoreData: any
  onNext: () => void
  isLast: boolean
}

export function FeedbackPanel({ scoreData, onNext, isLast }: FeedbackPanelProps) {
  const [showIdeal, setShowIdeal] = useState(false)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader className="text-center pb-2">
          <CardTitle>Answer Feedback</CardTitle>
          <CardDescription>Here is how you did on that question</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-8 pt-4">
          <ScoreGauge score={scoreData.score} grade={scoreData.grade} size={150} />
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Feedback</h3>
              <p className="text-muted-foreground">{scoreData.feedback}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold">Tone:</span>
              <Badge variant="outline" className="capitalize">{scoreData.toneAnalysis}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-100 dark:border-green-900/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-700 dark:text-green-400">Keywords Used Well</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap">
              {scoreData.keywordsUsed?.length > 0 ? (
                scoreData.keywordsUsed.map((kw: string, i: number) => (
                  <KeywordChip key={i} label={kw} className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300" />
                ))
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100 dark:border-red-900/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-700 dark:text-red-400">Points Missed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap">
              {scoreData.missedPoints?.length > 0 ? (
                scoreData.missedPoints.map((pt: string, i: number) => (
                  <KeywordChip key={i} label={pt} className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300" />
                ))
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 flex gap-4">
          <Lightbulb className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <h4 className="font-semibold">Improvement Tip</h4>
            <p className="text-sm mt-1">{scoreData.improvementTip}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="cursor-pointer pb-4" onClick={() => setShowIdeal(!showIdeal)}>
          <CardTitle className="text-base flex justify-between items-center">
            View Ideal Answer
            {showIdeal ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {showIdeal && (
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              {scoreData.idealAnswer}
            </p>
          </CardContent>
        )}
      </Card>

      {scoreData.followUpQuestion && (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 flex gap-4 items-start">
            <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Natural Follow-up Question</h4>
              <p className="text-sm text-muted-foreground mt-1">{scoreData.followUpQuestion}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={onNext}>
          {isLast ? "Complete Interview" : "Next Question"}
        </Button>
      </div>
    </div>
  )
}
