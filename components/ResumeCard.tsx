import React from 'react';
import { FileText, Eye, PlayCircle, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface ResumeCardProps {
  resume: any;
  latestScore?: number;
  onDelete?: (id: string) => void;
}

export function ResumeCard({ resume, latestScore, onDelete }: ResumeCardProps) {
  return (
    <Card className="transition-all hover:-translate-y-1 hover:shadow-md border-primary/10">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-primary/10 rounded-md text-primary shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-medium truncate text-sm" title={resume.fileName}>{resume.fileName}</h4>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(resume.uploadedAt || new Date()), { addSuffix: true })} ago</p>
            </div>
          </div>
          {latestScore !== undefined && latestScore > 0 && (
            <Badge className={latestScore >= 80 ? 'bg-green-500 hover:bg-green-600' : latestScore >= 60 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-500 hover:bg-red-600'}>
              {latestScore}
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground mb-4">
          {resume.wordCount} words
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-border/50">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" render={<Link href={`/resume/analysis/${resume._id}`} />} className="text-xs h-8">
              <Eye className="h-3.5 w-3.5 mr-1" /> Analysis
            </Button>
            <Button size="sm" variant="default" render={<Link href={`/interview?resumeId=${resume._id}`} />} className="text-xs h-8">
              <PlayCircle className="h-3.5 w-3.5 mr-1" /> Interview
            </Button>
          </div>
          {onDelete && (
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onDelete(resume._id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
