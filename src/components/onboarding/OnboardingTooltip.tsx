import { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';
import { cn } from '@/lib/utils';

interface OnboardingTooltipProps {
  steps: OnboardingStep[];
}

export function OnboardingTooltip({ steps }: OnboardingTooltipProps) {
  const {
    isOpen,
    currentStep,
    currentStepData,
    totalSteps,
    hasCompleted,
    next,
    prev,
    skip,
    replay,
  } = useOnboarding(steps);

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !currentStepData) return;

    const updatePosition = () => {
      const target = document.querySelector(currentStepData.target);
      if (target && tooltipRef.current) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        let top = 0;
        let left = 0;

        switch (currentStepData.placement || 'bottom') {
          case 'top':
            top = rect.top - tooltipRect.height - 12;
            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 12;
            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
            left = rect.left - tooltipRect.width - 12;
            break;
          case 'right':
            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
            left = rect.right + 12;
            break;
        }

        // Keep tooltip within viewport
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipRect.width - 16));
        top = Math.max(16, Math.min(top, window.innerHeight - tooltipRect.height - 16));

        setPosition({ top, left });

        // Highlight target element
        target.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'relative', 'z-50');
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      
      // Remove highlight from previous target
      const target = document.querySelector(currentStepData.target);
      if (target) {
        target.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'relative', 'z-50');
      }
    };
  }, [isOpen, currentStepData, currentStep]);

  if (!isOpen || !currentStepData) {
    return hasCompleted ? (
      <Button
        variant="outline"
        size="sm"
        onClick={replay}
        className="fixed bottom-4 right-4 z-40 gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Replay Tour
      </Button>
    ) : null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" />

      {/* Tooltip */}
      <Card
        ref={tooltipRef}
        className="fixed z-50 w-80 shadow-xl animate-fade-in"
        style={{ top: position.top, left: position.left }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-1" />
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">{currentStepData.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={skip}>
              Skip
            </Button>
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={prev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" onClick={next}>
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
              {currentStep < totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
