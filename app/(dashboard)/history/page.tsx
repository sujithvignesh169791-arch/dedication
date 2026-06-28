import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import connectDB from "@/db/connect"
import { ActivityHistory } from "@/models/ActivityHistory"
import mongoose from "mongoose"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default async function HistoryPage({ searchParams }: { searchParams: { filter?: string, page?: string } }) {
  const session = await auth()
  if (!session || !session.user?.id) redirect('/login')

  await connectDB()
  const uid = new mongoose.Types.ObjectId(session.user.id)
  
  const filter = searchParams.filter || 'all'
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const skip = (page - 1) * limit

  const query: any = { userId: uid }
  if (filter !== 'all') {
    query.action = filter
  }

  const [activities, total] = await Promise.all([
    ActivityHistory.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ActivityHistory.countDocuments(query)
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" render={<Link href="/dashboard" />} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Activity History</h1>
        <p className="text-muted-foreground mt-1">View all your past actions, analyses, and interviews.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'upload', 'analyze', 'interview', 'rebuild'].map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" render={<Link href={`/history?filter=${f}&page=1`} className="capitalize" />}>
            {f}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Resource Type</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activities.map((act: any) => (
                  <tr key={act._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {format(new Date(act.createdAt), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="px-6 py-4 capitalize font-medium">
                      {act.action}
                    </td>
                    <td className="px-6 py-4 capitalize text-muted-foreground">
                      {act.resourceType}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {act.action === 'analyze' && (
                        <Button size="sm" variant="outline" render={<Link href={`/resume/analysis/${act.resourceId}`} />}>View</Button>
                      )}
                      {act.action === 'interview' && (
                        <Button size="sm" variant="outline" render={<Link href={`/interview/results/${act.resourceId}`} />}>View</Button>
                      )}
                      {act.action === 'rebuild' && (
                        <Button size="sm" variant="outline" render={<Link href={`/resume/rebuilder/${act.resourceId}`} />}>View</Button>
                      )}
                    </td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      No activity found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button key={i} variant={page === i + 1 ? 'default' : 'outline'} size="sm" render={<Link href={`/history?filter=${filter}&page=${i + 1}`} />}>
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
