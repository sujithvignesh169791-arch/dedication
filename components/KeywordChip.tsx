import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface KeywordChipProps {
  label: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

export function KeywordChip({ label, variant = "secondary", className }: KeywordChipProps) {
  return (
    <Badge variant={variant} className={cn("mr-2 mb-2", className)}>
      {label}
    </Badge>
  )
}
