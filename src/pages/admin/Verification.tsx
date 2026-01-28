import { useState, useEffect } from 'react';
import { VerificationForm } from '@/components/admin/VerificationForm';
import { TransactionHistory } from '@/components/admin/TransactionHistory';
import { CertificateStatusGrid } from '@/components/admin/CertificateStatusGrid';
import { BlockchainStats } from '@/components/admin/BlockchainStats';
import { CertificateIssueForm } from '@/components/admin/CertificateIssueForm';
import { certificateServiceDB, CertificateData } from '@/services/supabase/certificateService';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, History, Grid3X3, Activity, FilePlus } from 'lucide-react';

import { Certificate, BlockchainTransaction } from '@/types';

export default function VerificationPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const data = await certificateServiceDB.getAllCertificates();
        // Convert to Certificate format
        const converted: Certificate[] = data.map(cert => ({
          id: cert.id,
          studentId: cert.student_id,
          studentName: cert.student?.full_name || 'Unknown Student',
          type: 'skill' as const,
          title: cert.title,
          issuer: cert.issuer,
          issueDate: cert.issue_date || cert.created_at,
          transactionHash: cert.blockchain_hash || '',
          blockNumber: 0,
          verified: cert.verified,
          metadata: {},
        }));
        setCertificates(converted);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  // Generate mock transactions from certificates (blockchain feature is simulated)
  const transactions: BlockchainTransaction[] = certificates
    .filter(c => c.transactionHash)
    .map(c => ({
      hash: c.transactionHash,
      type: 'issue' as const,
      status: (c.verified ? 'confirmed' : 'pending') as 'confirmed' | 'pending' | 'failed',
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      timestamp: c.issueDate,
      gasUsed: 21000 + Math.floor(Math.random() * 5000),
      certificateId: c.id,
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f1b',
      to: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    }));

  const blockchainStats = {
    totalCertificates: certificates.length,
    verifiedCertificates: certificates.filter(c => c.verified).length,
    pendingVerifications: certificates.filter(c => !c.verified).length,
    totalTransactions: transactions.length,
    latestBlock: transactions.length > 0 ? Math.max(...transactions.map(t => t.blockNumber)) : 0,
    avgGasUsed: transactions.length > 0 
      ? Math.round(transactions.reduce((sum, t) => sum + t.gasUsed, 0) / transactions.length)
      : 0,
  };

  const handleVerifyCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Blockchain Verification</h1>
        <p className="text-muted-foreground">Verify certificates and credentials on-chain</p>
      </div>

      {/* Blockchain Stats */}
      <BlockchainStats stats={blockchainStats} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="issue" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid mb-6">
          <TabsTrigger value="issue" className="gap-2">
            <FilePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Issue</span>
          </TabsTrigger>
          <TabsTrigger value="verify" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Verify</span>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2">
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Certificates</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Transactions</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Network</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issue">
          <CertificateIssueForm />
        </TabsContent>

        <TabsContent value="verify">
          <VerificationForm />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificateStatusGrid 
            certificates={certificates} 
            onVerify={handleVerifyCertificate}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionHistory transactions={transactions} />
        </TabsContent>

        <TabsContent value="network">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Network Status */}
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-success" />
                Network Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">Polygon Mainnet</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Chain ID</span>
                  <code className="font-mono text-sm bg-muted px-2 py-1 rounded">137</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-2 text-success">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gas Price</span>
                  <span className="font-mono text-sm">32 Gwei</span>
                </div>
              </div>
            </div>

            {/* Smart Contract Info */}
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Smart Contract
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Contract Name</span>
                  <span className="font-medium">CertificateRegistry</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Contract Address</span>
                  <code className="font-mono text-xs bg-muted px-2 py-1 rounded block break-all">
                    0x742d35Cc6634C0532925a3b844Bc9e7595f1bCBE
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono text-sm">v1.2.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Issuances</span>
                  <span className="font-medium">{certificates.length}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
