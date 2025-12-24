import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, Clock, Link2, Blocks, Fuel } from 'lucide-react';

interface BlockchainStatsProps {
  stats: {
    totalCertificates: number;
    verifiedCertificates: number;
    pendingVerifications: number;
    totalTransactions: number;
    latestBlock: number;
    avgGasUsed: number;
  };
}

export function BlockchainStats({ stats }: BlockchainStatsProps) {
  const statItems = [
    {
      label: 'Total Certificates',
      value: stats.totalCertificates,
      icon: Shield,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Verified',
      value: stats.verifiedCertificates,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Pending',
      value: stats.pendingVerifications,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Transactions',
      value: stats.totalTransactions,
      icon: Link2,
      color: 'text-secondary-foreground',
      bg: 'bg-secondary',
    },
    {
      label: 'Latest Block',
      value: stats.latestBlock.toLocaleString(),
      icon: Blocks,
      color: 'text-accent-foreground',
      bg: 'bg-accent',
    },
    {
      label: 'Avg Gas Used',
      value: stats.avgGasUsed.toLocaleString(),
      icon: Fuel,
      color: 'text-muted-foreground',
      bg: 'bg-muted',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
