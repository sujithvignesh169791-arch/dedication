import { Skeleton } from "@/components/ui/skeleton"

export default function InterviewLoading() {
  return (
    <div className="container mx-auto py-12 max-w-3xl flex flex-col items-center gap-6">
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <Skeleton className="h-12 w-full max-w-[200px]" />
    </div>
  )
}
