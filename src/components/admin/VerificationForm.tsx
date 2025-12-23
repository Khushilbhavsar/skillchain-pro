import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Certificate, VerificationResult } from '@/types';
import { mockCertificates } from '@/services/mockData';
import { Shield, Search, CheckCircle, XCircle, Clock, ExternalLink, Copy, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function VerificationForm() {
  const [transactionHash, setTransactionHash] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const simulateVerification = async (hash?: string, certId?: string): Promise<VerificationResult> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const cert = mockCertificates.find(
      c => c.transactionHash === hash || c.id === certId
    );

    if (cert) {
      return {
        isValid: true,
        certificate: cert,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      isValid: false,
      error: 'Certificate not found on the blockchain. Please verify the hash or ID.',
      timestamp: new Date().toISOString(),
    };
  };

  const handleVerifyByHash = async () => {
    if (!transactionHash.trim()) {
      toast.error('Please enter a transaction hash');
      return;
    }
    setIsVerifying(true);
    setResult(null);
    const verificationResult = await simulateVerification(transactionHash);
    setResult(verificationResult);
    setIsVerifying(false);
  };

  const handleVerifyById = async () => {
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }
    setIsVerifying(true);
    setResult(null);
    const verificationResult = await simulateVerification(undefined, certificateId);
    setResult(verificationResult);
    setIsVerifying(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Certificate Verification</CardTitle>
              <CardDescription>
                Verify academic credentials and skill certificates on the blockchain
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hash" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="hash">By Transaction Hash</TabsTrigger>
              <TabsTrigger value="id">By Certificate ID</TabsTrigger>
            </TabsList>

            <TabsContent value="hash" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="txHash">Transaction Hash</Label>
                <div className="flex gap-2">
                  <Input
                    id="txHash"
                    placeholder="0x..."
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button onClick={handleVerifyByHash} disabled={isVerifying}>
                    {isVerifying ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Verifying
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the transaction hash from the certificate to verify its authenticity on Ethereum/Polygon.
              </p>
            </TabsContent>

            <TabsContent value="id" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certId">Certificate ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="certId"
                    placeholder="cert1, cert2, etc."
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                  />
                  <Button onClick={handleVerifyById} disabled={isVerifying}>
                    {isVerifying ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Verifying
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the certificate ID to look up and verify the certificate.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Verification Result */}
      {result && (
        <Card className={cn('animate-fade-in', result.isValid ? 'border-success/50' : 'border-destructive/50')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              {result.isValid ? (
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
              )}
              <div>
                <CardTitle className={result.isValid ? 'text-success' : 'text-destructive'}>
                  {result.isValid ? 'Certificate Verified' : 'Verification Failed'}
                </CardTitle>
                <CardDescription>
                  Checked at {new Date(result.timestamp).toLocaleString()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {result.isValid && result.certificate && (
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Certificate Type</p>
                  <Badge variant="outline" className="capitalize">
                    {result.certificate.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{result.certificate.title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{result.certificate.studentName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Issuer</p>
                  <p className="font-medium">{result.certificate.issuer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">
                    {new Date(result.certificate.issueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Block Number</p>
                  <p className="font-mono text-sm">{result.certificate.blockNumber.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
                    {result.certificate.transactionHash}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(result.certificate!.transactionHash)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={`https://etherscan.io/tx/${result.certificate.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {Object.keys(result.certificate.metadata).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Additional Metadata</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(result.certificate.metadata).map(([key, value]) => (
                      <Badge key={key} variant="secondary">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          )}

          {!result.isValid && (
            <CardContent>
              <p className="text-muted-foreground">{result.error}</p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Recent Verifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sample Certificates (For Testing)</CardTitle>
          <CardDescription>
            Use these certificate IDs to test the verification system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {mockCertificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setCertificateId(cert.id);
                  toast.info(`Certificate ID "${cert.id}" copied to input`);
                }}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{cert.title}</p>
                    <p className="text-xs text-muted-foreground">{cert.studentName}</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: {cert.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
