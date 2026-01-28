import { Company } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Users, IndianRupee, ExternalLink, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  company: Company;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
  onViewJobs?: (company: Company) => void;
}

const statusStyles = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-border',
  blacklisted: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function CompanyCard({ company, onEdit, onDelete, onViewJobs }: CompanyCardProps) {
  const formatPackage = (pkg: number) => {
    if (pkg >= 100000) {
      return `₹${(pkg / 100000).toFixed(1)} LPA`;
    }
    return `₹${pkg.toLocaleString()}`;
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 className="w-7 h-7 text-muted-foreground" />
              )}
            </div>
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
        <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-medium">{company.totalHires}</span>
            <span className="text-muted-foreground">hires</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="w-4 h-4 text-success" />
            <span className="font-medium">{formatPackage(company.averagePackage)}</span>
            <span className="text-muted-foreground">avg</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{company.locations.slice(0, 3).join(', ')}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewJobs?.(company)}>
            View Jobs
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
