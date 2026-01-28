import { memo } from 'react';
import { Company } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, Mail, Phone, MapPin, Users, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MemoizedCompanyCardProps {
  company: Company;
  onView?: (company: Company) => void;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

const statusStyles = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-border',
  blacklisted: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const MemoizedCompanyCard = memo(function MemoizedCompanyCard({ 
  company, 
  onView, 
  onEdit, 
  onDelete 
}: MemoizedCompanyCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={company.logo} alt={company.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {company.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-display font-semibold text-lg">{company.name}</h3>
              <p className="text-sm text-muted-foreground">{company.industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('capitalize', statusStyles[company.status])}>
              {company.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(company)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(company)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(company)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {company.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
        )}

        <div className="space-y-2">
          {company.locations.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{company.locations.join(', ')}</span>
            </div>
          )}
          {company.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {company.contactEmail && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{company.contactEmail}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-success" />
            <span className="font-medium">{company.totalHires} hires</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return prevProps.company.id === nextProps.company.id && 
         prevProps.company.status === nextProps.company.status &&
         prevProps.company.totalHires === nextProps.company.totalHires;
});
