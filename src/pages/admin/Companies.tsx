import { CompanyCard } from '@/components/admin/CompanyCard';
import { mockCompanies } from '@/services/mockData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CompaniesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Companies</h1>
          <p className="text-muted-foreground">Manage recruiting partners</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Add Company</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
