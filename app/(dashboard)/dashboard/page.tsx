import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserStats } from "@/lib/services/stats"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your resume scores and interview progress.",
}
import { ResumeCard } from "@/components/ResumeCard"
import { ProgressTimeline } from "@/components/ProgressTimeline"
import { DashboardCharts } from "./DashboardCharts"
import { Upload, Star, TrendingUp, TrendingDown, Minus, PlayCircle, Lock } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session || !session.user?.id) redirect('/login')

  const stats = await getUserStats(session.user.id)
  
  const getGrade = (score: number) => score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
  const bestGrade = stats.bestAtsScore ? getGrade(stats.bestAtsScore) : '-'

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {stats.name?.split(' ')[0] || 'User'}</h1>
            {stats.isPremium && <Badge className="bg-amber-500 hover:bg-amber-600 text-white"><Star className="h-3 w-3 mr-1 fill-white" /> Pro</Badge>}
          </div>
          <p className="text-muted-foreground">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/resume/upload" />}>
            <Upload className="h-4 w-4 mr-2" /> Upload Resume
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Best ATS Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{stats.bestAtsScore || 0}</div>
              {stats.bestAtsScore > 0 && <Badge variant="outline" className="text-xs">{bestGrade}</Badge>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{stats.totalInterviews}</div>
              <span className="text-xs text-muted-foreground">Avg score: {stats.averageInterviewScore}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resumes Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalResumes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{stats.atsScoreImprovement > 0 ? '+' : ''}{stats.atsScoreImprovement}</div>
              {stats.atsScoreImprovement > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : stats.atsScoreImprovement < 0 ? (
                <TrendingDown className="h-5 w-5 text-red-500" />
              ) : (
                <Minus className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>ATS Score Trend</CardTitle>
              <CardDescription>Your resume score history over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <DashboardCharts 
                atsHistory={stats.atsScoreHistory} 
                interviewHistory={stats.interviewScoreHistory} 
              />
            </CardContent>
          </Card>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-tight">Recent Resumes</h2>
              <Button variant="link" render={<Link href="/history" />}>View all</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.recentResumes.length > 0 ? (
                stats.recentResumes.map((r: any) => (
                  <ResumeCard key={r._id} resume={r} latestScore={stats.latestAtsScore} />
                ))
              ) : (
                <div className="col-span-2 p-8 text-center border rounded-lg bg-muted/20 border-dashed">
                  <p className="text-muted-foreground mb-4">No resumes uploaded yet.</p>
                  <Button variant="outline" render={<Link href="/resume/upload" />}>Upload your first resume</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {!stats.isPremium && (
            <Card className="bg-gradient-to-br from-amber-500/10 via-background to-background border-amber-500/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Star className="h-24 w-24 fill-amber-500 text-amber-500" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-lg flex items-center gap-2"><Lock className="h-4 w-4 text-amber-500" /> Upgrade to Pro</CardTitle>
                <CardDescription>Unlock resume rebuilder and voice interviews.</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 relative z-10">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white" render={<Link href="/premium" />}>
                  View Pro Features
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" render={<Link href="/resume/upload" />}>
                <Upload className="mr-2 h-4 w-4" /> Upload New Resume
              </Button>
              <Button variant="outline" className="w-full justify-start" render={<Link href="/interview" />}>
                <PlayCircle className="mr-2 h-4 w-4" /> Practice Interview
              </Button>
              <Button variant="outline" className="w-full justify-start" render={<Link href="/history" />}>
                View Full History
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressTimeline activities={stats.recentActivity} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
