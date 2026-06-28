import { Skeleton } from "@/components/ui/skeleton"

export default function AnalysisLoading() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Skeleton className="h-8 w-[300px]" />
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  )
}
