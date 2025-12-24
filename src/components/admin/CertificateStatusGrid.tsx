import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Certificate } from '@/types';
import { Shield, CheckCircle, Clock, AlertTriangle, ExternalLink, User, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificateStatusGridProps {
  certificates: Certificate[];
  onVerify?: (certificate: Certificate) => void;
}

export function CertificateStatusGrid({ certificates, onVerify }: CertificateStatusGridProps) {
  const getStatusConfig = (verified: boolean) => {
    if (verified) {
      return {
        icon: CheckCircle,
        label: 'Verified',
        color: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success/20',
      };
    }
    return {
      icon: Clock,
      label: 'Pending',
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
    };
  };

  const getTypeIcon = (type: Certificate['type']) => {
    switch (type) {
      case 'skill':
        return <Shield className="w-4 h-4" />;
      case 'degree':
        return <Building className="w-4 h-4" />;
      case 'placement':
        return <User className="w-4 h-4" />;
      case 'achievement':
        return <Shield className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Certificate Status Overview</CardTitle>
        <CardDescription>
          All certificates registered on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => {
            const status = getStatusConfig(cert.verified);
            const StatusIcon = status.icon;

            return (
              <div
                key={cert.id}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all hover:shadow-md',
                  status.border,
                  status.bg
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('p-2 rounded-lg', status.bg)}>
                    {getTypeIcon(cert.type)}
                  </div>
                  <Badge variant="outline" className={cn('capitalize', status.color, status.border)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-sm mb-1 line-clamp-1">{cert.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{cert.studentName}</p>

                {/* Details */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Issuer</span>
                    <span className="font-medium">{cert.issuer}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span className="font-medium">
                      {new Date(cert.issueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Block</span>
                    <span className="font-mono">{cert.blockNumber.toLocaleString()}</span>
                  </div>
                </div>

                {/* Metadata Tags */}
                {Object.keys(cert.metadata).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {Object.entries(cert.metadata).slice(0, 2).map(([key, value]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => onVerify?.(cert)}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Verify
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={`https://polygonscan.com/tx/${cert.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
