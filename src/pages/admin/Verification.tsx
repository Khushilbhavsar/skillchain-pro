import { useState } from 'react';
import { VerificationForm } from '@/components/admin/VerificationForm';
import { TransactionHistory } from '@/components/admin/TransactionHistory';
import { CertificateStatusGrid } from '@/components/admin/CertificateStatusGrid';
import { BlockchainStats } from '@/components/admin/BlockchainStats';
import { CertificateIssueForm } from '@/components/admin/CertificateIssueForm';
import { mockCertificates, mockTransactions } from '@/services/mockData';
import { Certificate } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, History, Grid3X3, Activity, FilePlus } from 'lucide-react';

export default function VerificationPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const blockchainStats = {
    totalCertificates: mockCertificates.length,
    verifiedCertificates: mockCertificates.filter(c => c.verified).length,
    pendingVerifications: mockCertificates.filter(c => !c.verified).length,
    totalTransactions: mockTransactions.length,
    latestBlock: Math.max(...mockTransactions.map(t => t.blockNumber)),
    avgGasUsed: Math.round(mockTransactions.reduce((sum, t) => sum + t.gasUsed, 0) / mockTransactions.length),
  };

  const handleVerifyCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    // Scroll to verification form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            certificates={mockCertificates} 
            onVerify={handleVerifyCertificate}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionHistory transactions={mockTransactions} />
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
                  <span className="font-medium">{mockCertificates.length}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
