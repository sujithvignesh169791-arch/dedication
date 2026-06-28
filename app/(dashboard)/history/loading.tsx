import { Skeleton } from "@/components/ui/skeleton"

export default function HistoryLoading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-6">
      <Skeleton className="h-8 w-[250px]" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 w-20" />)}
      </div>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  )
}
