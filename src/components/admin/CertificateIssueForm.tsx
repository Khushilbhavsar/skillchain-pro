import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  FileCheck, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  Cpu,
  Zap,
  Clock,
  Hash
} from 'lucide-react';
import { mockStudents } from '@/services/mockData';

type TransactionStatus = 'idle' | 'preparing' | 'signing' | 'broadcasting' | 'confirming' | 'confirmed' | 'failed';

interface TransactionState {
  status: TransactionStatus;
  hash?: string;
  blockNumber?: number;
  gasUsed?: number;
  timestamp?: Date;
}

export function CertificateIssueForm() {
  const [formData, setFormData] = useState({
    studentId: '',
    certificateType: '',
    title: '',
    description: '',
    issueDate: new Date().toISOString().split('T')[0],
  });
  
  const [transaction, setTransaction] = useState<TransactionState>({ status: 'idle' });

  const certificateTypes = [
    { value: 'degree', label: 'Degree Certificate' },
    { value: 'skill', label: 'Skill Certification' },
    { value: 'internship', label: 'Internship Completion' },
    { value: 'achievement', label: 'Achievement Award' },
    { value: 'course', label: 'Course Completion' },
  ];

  const getStatusMessage = (status: TransactionStatus): string => {
    const messages: Record<TransactionStatus, string> = {
      idle: 'Ready to issue',
      preparing: 'Preparing transaction...',
      signing: 'Signing with institutional key...',
      broadcasting: 'Broadcasting to Polygon network...',
      confirming: 'Waiting for block confirmation...',
      confirmed: 'Certificate issued successfully!',
      failed: 'Transaction failed',
    };
    return messages[status];
  };

  const simulateBlockchainTransaction = async () => {
    // Validate form
    if (!formData.studentId || !formData.certificateType || !formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Step 1: Preparing
      setTransaction({ status: 'preparing' });
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Signing
      setTransaction({ status: 'signing' });
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Step 3: Broadcasting
      setTransaction({ status: 'broadcasting' });
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Confirming
      setTransaction({ status: 'confirming' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 5: Confirmed
      const txHash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      
      setTransaction({
        status: 'confirmed',
        hash: txHash,
        blockNumber: 52847391 + Math.floor(Math.random() * 100),
        gasUsed: 85000 + Math.floor(Math.random() * 15000),
        timestamp: new Date(),
      });

      toast.success('Certificate issued on-chain successfully!');

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          studentId: '',
          certificateType: '',
          title: '',
          description: '',
          issueDate: new Date().toISOString().split('T')[0],
        });
      }, 3000);

    } catch (error) {
      setTransaction({ status: 'failed' });
      toast.error('Transaction failed. Please try again.');
    }
  };

  const isProcessing = !['idle', 'confirmed', 'failed'].includes(transaction.status);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Issue Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            Issue New Certificate
          </CardTitle>
          <CardDescription>
            Create and record a new certificate on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Student *</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => setFormData({ ...formData, studentId: value })}
              disabled={isProcessing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {mockStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - {student.rollNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificateType">Certificate Type *</Label>
            <Select
              value={formData.certificateType}
              onValueChange={(value) => setFormData({ ...formData, certificateType: value })}
              disabled={isProcessing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent>
                {certificateTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Certificate Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Bachelor of Technology in Computer Science"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details about the certificate..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isProcessing}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              id="issueDate"
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              disabled={isProcessing}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={simulateBlockchainTransaction}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Issue Certificate On-Chain
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            Transaction Status
          </CardTitle>
          <CardDescription>
            Real-time blockchain transaction monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status Steps */}
          <div className="space-y-4 mb-6">
            {(['preparing', 'signing', 'broadcasting', 'confirming', 'confirmed'] as TransactionStatus[]).map((step, index) => {
              const steps: TransactionStatus[] = ['preparing', 'signing', 'broadcasting', 'confirming', 'confirmed'];
              const currentIndex = steps.indexOf(transaction.status);
              const stepIndex = index;
              
              let stepStatus: 'pending' | 'active' | 'complete' = 'pending';
              if (stepIndex < currentIndex || transaction.status === 'confirmed') {
                stepStatus = 'complete';
              } else if (stepIndex === currentIndex && transaction.status !== 'idle' && transaction.status !== 'failed') {
                stepStatus = 'active';
              }

              return (
                <div key={step} className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${stepStatus === 'complete' ? 'bg-success text-success-foreground' : ''}
                    ${stepStatus === 'active' ? 'bg-primary text-primary-foreground animate-pulse' : ''}
                    ${stepStatus === 'pending' ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    {stepStatus === 'complete' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : stepStatus === 'active' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-sm ${stepStatus === 'pending' ? 'text-muted-foreground' : ''}`}>
                    {getStatusMessage(step)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Transaction Details */}
          {transaction.status === 'confirmed' && transaction.hash && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/20 space-y-3">
              <div className="flex items-center gap-2 text-success font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Transaction Confirmed
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground block">Transaction Hash</span>
                    <code className="font-mono text-xs break-all">{transaction.hash}</code>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Block:</span>
                  <Badge variant="secondary">#{transaction.blockNumber}</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Gas Used:</span>
                  <span>{transaction.gasUsed?.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Time:</span>
                  <span>{transaction.timestamp?.toLocaleTimeString()}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-2">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Polygonscan
              </Button>
            </div>
          )}

          {transaction.status === 'idle' && (
            <div className="text-center py-8 text-muted-foreground">
              <Cpu className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Fill out the form and submit to issue a certificate</p>
            </div>
          )}

          {transaction.status === 'failed' && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-destructive font-medium">Transaction Failed</p>
              <p className="text-sm text-muted-foreground mt-1">Please try again</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
