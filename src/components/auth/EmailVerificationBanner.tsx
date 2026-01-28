import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2, X } from 'lucide-react';

interface EmailVerificationBannerProps {
  email: string;
  onDismiss?: () => void;
}

export function EmailVerificationBanner({ email, onDismiss }: EmailVerificationBannerProps) {
  const [isResending, setIsResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);
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
      toast({
        title: 'Email Sent',
        description: 'Verification email has been resent. Please check your inbox.',
      });
    }

    setIsResending(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  return (
    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-warning/20">
          <Mail className="w-4 h-4 text-warning" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm mb-1">Verify your email</h4>
          <p className="text-sm text-muted-foreground mb-3">
            We sent a verification link to <strong>{email}</strong>. 
            Please check your inbox and spam folder.
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              Resend Email
            </Button>
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
