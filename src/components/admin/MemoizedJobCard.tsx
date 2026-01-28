import { memo } from 'react';
import { Job } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, IndianRupee, Clock, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MemoizedJobCardProps {
  job: Job;
  onView?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
}

const statusStyles = {
  open: 'bg-success/10 text-success border-success/20',
  closed: 'bg-muted text-muted-foreground border-border',
  in_progress: 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-info/10 text-info border-info/20',
};

const typeStyles = {
  full_time: 'bg-primary/10 text-primary border-primary/20',
  internship: 'bg-info/10 text-info border-info/20',
  contract: 'bg-warning/10 text-warning border-warning/20',
};

const typeLabels = {
  full_time: 'Full Time',
  internship: 'Internship',
  contract: 'Contract',
};

export const MemoizedJobCard = memo(function MemoizedJobCard({ 
  job, 
  onView, 
  onEdit, 
  onDelete 
}: MemoizedJobCardProps) {
  const formatPackage = (min: number, max: number) => {
    const formatValue = (val: number) => {
      if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
      return val.toString();
    };
    return `₹${formatValue(min)} - ${formatValue(max)}`;
  };

  const daysUntilDeadline = () => {
    const deadline = new Date(job.applicationDeadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = daysUntilDeadline();

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-lg">{job.title}</h3>
              <Badge variant="outline" className={cn('text-xs', typeStyles[job.type])}>
                {typeLabels[job.type]}
              </Badge>
            </div>
            <p className="text-primary font-medium">{job.companyName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('capitalize', statusStyles[job.status])}>
              {job.status.replace('_', ' ')}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(job)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(job)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(job)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="w-4 h-4 text-success" />
            <span className="font-medium">{formatPackage(job.packageMin, job.packageMax)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">{job.locations.slice(0, 2).join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span>{job.applicantsCount} applicants</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className={cn('w-4 h-4', days <= 3 ? 'text-destructive' : days <= 7 ? 'text-warning' : 'text-muted-foreground')} />
            <span className={cn(days <= 3 ? 'text-destructive' : days <= 7 ? 'text-warning' : '')}>
              {days > 0 ? `${days} days left` : 'Deadline passed'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.eligibilityCriteria.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.eligibilityCriteria.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{job.eligibilityCriteria.skills.length - 3}
            </Badge>
          )}
        </div>

        {job.driveDate && (
          <div className="flex items-center gap-2 text-sm pt-2 border-t">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Drive: {new Date(job.driveDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memoization
  return prevProps.job.id === nextProps.job.id && 
         prevProps.job.status === nextProps.job.status &&
         prevProps.job.applicantsCount === nextProps.job.applicantsCount;
});
