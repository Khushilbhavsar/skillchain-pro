import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VerificationPendingCardProps {
  email: string;
  onBackToSignIn?: () => void;
}

export function VerificationPendingCard({ email, onBackToSignIn }: VerificationPendingCardProps) {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { resendVerificationEmail } = useAuth();
  const { toast } = useToast();

  const handleResend = async () => {
    setIsResending(true);

    const { error } = await resendVerificationEmail(email);

    if (error) {
      toast({
        title: 'Failed to Resend',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setResent(true);
      toast({
        title: 'Email Sent',
        description: 'Verification email has been resent. Please check your inbox.',
      });
    }

    setIsResending(false);
  };

  return (
    <Card className="border-border/50 shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription className="text-base">
          We've sent a verification link to your email
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Verification email sent to:</p>
          <p className="font-medium text-foreground">{email}</p>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
            <span>Check your inbox for the verification email</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
            <span>Click the link in the email to verify your account</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
            <span>Don't forget to check your spam folder</span>
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isResending || resent}
          >
            {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {resent ? 'Email Resent!' : 'Resend Verification Email'}
          </Button>
          
          {onBackToSignIn ? (
            <Button
              variant="ghost"
              className="w-full"
              onClick={onBackToSignIn}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          ) : (
            <Link to="/" className="block">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
