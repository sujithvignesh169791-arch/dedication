"use client"
import React, { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface SectionScoreBarProps {
  label: string
  score: number
  colorClass?: string
  className?: string
}

export function SectionScoreBar({ label, score, colorClass, className }: SectionScoreBarProps) {
  const [currentScore, setCurrentScore] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentScore(score)
    }, 100)
    return () => clearTimeout(timeout)
  }, [score])

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span>{Math.round(currentScore)}%</span>
      </div>
      {/* We use default primary color if colorClass isn't fully controlling it, but provide it as an option */}
      <Progress value={currentScore} className={cn("h-2", colorClass)} />
    </div>
  )
}
