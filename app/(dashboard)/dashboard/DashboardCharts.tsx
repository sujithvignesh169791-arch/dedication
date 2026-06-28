"use client"

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

export function DashboardCharts({ atsHistory, interviewHistory }: { atsHistory: any[], interviewHistory: any[] }) {
  
  const formattedAtsData = atsHistory.map(h => ({
    ...h,
    dateLabel: format(new Date(h.date), 'MMM d')
  }))

  if (formattedAtsData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center border-dashed border-2 rounded-lg bg-muted/10">
        <p className="text-sm text-muted-foreground">Not enough data. Analyze a resume to see trends.</p>
      </div>
    )
  }

  let trendColor = 'hsl(var(--primary))' 
  if (formattedAtsData.length > 1) {
    const first = formattedAtsData[0].score
    const last = formattedAtsData[formattedAtsData.length - 1].score
    if (last > first) trendColor = '#22c55e'
    if (last < first) trendColor = '#ef4444'
    if (last === first) trendColor = '#f59e0b'
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedAtsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
        <XAxis dataKey="dateLabel" fontSize={12} tickMargin={10} stroke="hsl(var(--muted-foreground))" />
        <YAxis domain={[0, 100]} fontSize={12} stroke="hsl(var(--muted-foreground))" />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
          formatter={(value: any, name: any, props: any) => [`Score: ${value}`, props.payload.resumeName]}
        />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke={trendColor} 
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2, fill: 'var(--background)' }} 
          activeDot={{ r: 6, fill: trendColor }} 
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
