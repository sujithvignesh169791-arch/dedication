import React from 'react';
import { Upload, Activity, Mic, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProgressTimelineProps {
  activities: any[];
}

export function ProgressTimeline({ activities }: ProgressTimelineProps) {
  if (!activities || activities.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent activity.</p>;
  }

  const getIcon = (action: string) => {
    switch(action) {
      case 'upload': return <Upload className="h-4 w-4 text-blue-500" />;
      case 'analyze': return <Activity className="h-4 w-4 text-purple-500" />;
      case 'interview': return <Mic className="h-4 w-4 text-green-500" />;
      case 'rebuild': return <RefreshCw className="h-4 w-4 text-amber-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBg = (action: string) => {
    switch(action) {
      case 'upload': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'analyze': return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
      case 'interview': return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'rebuild': return 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      default: return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="relative border-l border-muted ml-3 space-y-6">
      {activities.map((act) => (
        <div key={act._id} className="relative pl-6">
          <div className={`absolute -left-3.5 top-0.5 p-1.5 rounded-full ${getBg(act.action)} border ring-2 ring-background`}>
            {getIcon(act.action)}
          </div>
          <div>
            <p className="text-sm font-medium capitalize">{act.action} {act.resourceType}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
