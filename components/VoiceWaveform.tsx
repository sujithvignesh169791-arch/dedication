import React from 'react'
import { cn } from '@/lib/utils'

interface VoiceWaveformProps {
  isActive: boolean
  className?: string
}

export function VoiceWaveform({ isActive, className }: VoiceWaveformProps) {
  return (
    <div className={cn("flex items-center justify-center gap-1.5 h-16", className)}>
      <style>{`
        @keyframes wave {
          0% { height: 10%; }
          50% { height: 100%; }
          100% { height: 10%; }
        }
      `}</style>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            "w-3 bg-primary rounded-full transition-all duration-300",
            !isActive && "h-2"
          )}
          style={isActive ? { height: '10%', animation: `wave 1s ease-in-out ${i * 0.15}s infinite` } : {}}
        />
      ))}
    </div>
  )
}
