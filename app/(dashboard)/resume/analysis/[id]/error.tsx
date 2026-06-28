"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

export default function AnalysisError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  const router = useRouter()
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="py-24 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-destructive/10 p-3 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-bold mb-2 text-destructive">Failed to load analysis</h2>
      <p className="text-muted-foreground mb-6">There was a problem retrieving this resume's analysis data.</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>Go back</Button>
      </div>
    </div>
  )
}
