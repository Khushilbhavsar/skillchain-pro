import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlockchainTransaction } from '@/types';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TransactionHistoryProps {
  transactions: BlockchainTransaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Hash copied to clipboard');
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const getStatusIcon = (status: BlockchainTransaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: BlockchainTransaction['status']) => {
    const variants: Record<BlockchainTransaction['status'], string> = {
      confirmed: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return variants[status];
  };

  const getTypeIcon = (type: BlockchainTransaction['type']) => {
    switch (type) {
      case 'issue':
        return <ArrowUpRight className="w-4 h-4 text-primary" />;
      case 'verify':
        return <ArrowDownLeft className="w-4 h-4 text-secondary-foreground" />;
      case 'revoke':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaction History</CardTitle>
        <CardDescription>
          Recent blockchain transactions for certificate operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.hash}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
            >
              {/* Type Icon */}
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                {getTypeIcon(tx.type)}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium capitalize">{tx.type} Certificate</span>
                  <Badge variant="outline" className={cn('text-xs', getStatusBadge(tx.status))}>
                    {getStatusIcon(tx.status)}
                    <span className="ml-1">{tx.status}</span>
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <code className="font-mono text-xs">{truncateHash(tx.hash)}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(tx.hash)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                {tx.certificateId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Certificate: {tx.certificateId}
                  </p>
                )}
              </div>

              {/* Right Side Info */}
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">Block #{tx.blockNumber.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(tx.timestamp).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Gas: {tx.gasUsed.toLocaleString()}
                </p>
              </div>

              {/* External Link */}
              <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <a
                  href={`https://polygonscan.com/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
