import React from 'react'
import { Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MicButtonProps {
  isListening: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function MicButton({ isListening, onClick, disabled, className }: MicButtonProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" style={{ animationDuration: '2s' }} />
        </>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative z-10 flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 shadow-lg",
          isListening 
            ? "bg-red-500 text-white hover:bg-red-600 scale-110" 
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
          disabled && "opacity-50 cursor-not-allowed hover:scale-100"
        )}
      >
        {isListening ? <Mic className="h-8 w-8" /> : <MicOff className="h-8 w-8" />}
      </button>
    </div>
  )
}
