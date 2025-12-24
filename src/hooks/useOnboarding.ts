import { useState, useEffect, useCallback } from 'react';

export interface OnboardingStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_KEY = 'placechain_onboarding_complete';

export function useOnboarding(steps: OnboardingStep[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (completed === 'true') {
      setHasCompleted(true);
    } else {
      // Start onboarding for first-time users after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      complete();
    }
  }, [currentStep, steps.length]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const skip = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompleted(true);
  }, []);

  const complete = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompleted(true);
  }, []);

  const replay = useCallback(() => {
    setCurrentStep(0);
    setIsOpen(true);
    setHasCompleted(false);
    localStorage.removeItem(ONBOARDING_KEY);
  }, []);

  return {
    isOpen,
    currentStep,
    currentStepData: steps[currentStep],
    totalSteps: steps.length,
    hasCompleted,
    next,
    prev,
    skip,
    complete,
    replay,
  };
}
