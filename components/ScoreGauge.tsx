"use client"
import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreGaugeProps {
  score: number
  grade: string
  size?: number
  animated?: boolean
  className?: string
}

export function ScoreGauge({ score, grade, size = 200, animated = true, className }: ScoreGaugeProps) {
  const [currentScore, setCurrentScore] = useState(animated ? 0 : score)
  
  useEffect(() => {
    if (animated) {
      const timeout = setTimeout(() => {
        setCurrentScore(score)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [score, animated])

  const strokeWidth = size * 0.08
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (currentScore / 100) * circumference

  let color = "text-green-500"
  if (score < 40) color = "text-red-500"
  else if (score < 70) color = "text-amber-500"

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-1000 ease-out", color)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold">{Math.round(currentScore)}</span>
        <span className="text-xl font-semibold text-muted-foreground mt-1">Grade {grade}</span>
      </div>
    </div>
  )
}
