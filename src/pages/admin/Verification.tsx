import { VerificationForm } from '@/components/admin/VerificationForm';

export default function VerificationPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Blockchain Verification</h1>
        <p className="text-muted-foreground">Verify certificates and credentials on-chain</p>
      </div>
      <VerificationForm />
    </div>
  );
}
