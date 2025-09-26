import { useEffect } from 'react';
import { useStepperStore } from '@/store';
import type { Answer, StepNavigationInfo, FormAnswerValue } from '@/types';

interface UseSurveyStepperProps {
  surveyId: string;
  sessionId?: string;
  initialAnswers?: Answer[];
  autoInitialize?: boolean;
}

export const useSurveyStepper = ({
  surveyId,
  sessionId,
  initialAnswers,
  autoInitialize = true,
}: UseSurveyStepperProps) => {
  // Store selectors - select individual values to prevent re-renders
  const session = useStepperStore(state => state.session);
  const currentStep = useStepperStore(state => state.currentStep);
  const isLoading = useStepperStore(state => state.isLoading);
  const isSubmitting = useStepperStore(state => state.isSubmitting);
  const error = useStepperStore(state => state.error);
  const validationErrors = useStepperStore(state => state.validationErrors);
  const hasUnsavedChanges = useStepperStore(state => state.hasUnsavedChanges);

  // Store actions
  const initializeSession = useStepperStore(state => state.initializeSession);
  const loadSession = useStepperStore(state => state.loadSession);
  const saveCurrentAnswers = useStepperStore(state => state.saveCurrentAnswers);
  const navigateToStep = useStepperStore(state => state.navigateToStep);
  const jumpToStep = useStepperStore(state => state.jumpToStep);
  const resetSession = useStepperStore(state => state.resetSession);
  const setAnswer = useStepperStore(state => state.setAnswer);
  const clearError = useStepperStore(state => state.clearError);
  const markUnsavedChanges = useStepperStore(state => state.markUnsavedChanges);
  const getNavigationInfo = useStepperStore(state => state.getNavigationInfo);
  const getCurrentStepAnswers = useStepperStore(
    state => state.getCurrentStepAnswers
  );
  const getAnswerValue = useStepperStore(state => state.getAnswerValue);

  // Initialize session on mount
  useEffect(() => {
    if (autoInitialize && !session && surveyId) {
      if (sessionId) {
        loadSession(sessionId);
      } else {
        initializeSession(surveyId, initialAnswers);
      }
    }
  }, [
    autoInitialize,
    session,
    surveyId,
    sessionId,
    initialAnswers,
    loadSession,
    initializeSession,
  ]);

  // Computed values
  const navigationInfo: StepNavigationInfo = getNavigationInfo();
  const currentStepAnswers = getCurrentStepAnswers();
  const progress = session?.progress || {
    completedSteps: 0,
    totalSteps: 0,
    percentage: 0,
  };

  // Navigation handlers
  const goNext = async () => {
    if (navigationInfo.canGoNext) {
      await navigateToStep('next');
    }
  };

  const goPrevious = async () => {
    if (navigationInfo.canGoPrevious) {
      await navigateToStep('previous');
    }
  };

  const goToStep = async (stepIndex: number) => {
    if (session && stepIndex >= 0 && stepIndex < session.steps.length) {
      await jumpToStep(stepIndex);
    }
  };

  // Answer management
  const updateAnswer = (questionId: string, value: FormAnswerValue) => {
    setAnswer(questionId, value);
  };

  const saveAnswers = async () => {
    if (currentStepAnswers.length > 0) {
      await saveCurrentAnswers(currentStepAnswers);
    }
  };

  const getQuestionAnswer = (questionId: string) => {
    return getAnswerValue(questionId);
  };

  // Validation helpers
  const validateCurrentStep = (): boolean => {
    // Basic validation - can be extended based on business rules
    if (!currentStep) return false;

    // Check if required questions have answers
    const hasRequiredAnswers = currentStep.questionIds.every(questionId => {
      const answer = getAnswerValue(questionId);
      return answer !== undefined && answer !== null && answer !== '';
    });

    return hasRequiredAnswers;
  };

  const canProceedToNext = (): boolean => {
    return navigationInfo.canGoNext && validateCurrentStep();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges) {
        // Could show warning or auto-save here
        console.warn('Unsaved changes detected during unmount');
      }
    };
  }, [hasUnsavedChanges]);

  return {
    // State
    session,
    currentStep,
    isLoading,
    isSubmitting,
    error,
    validationErrors,
    hasUnsavedChanges,
    progress,
    navigationInfo,
    currentStepAnswers,

    // Actions
    initializeSession,
    loadSession,
    resetSession,
    clearError,

    // Navigation
    goNext,
    goPrevious,
    goToStep,
    canProceedToNext,

    // Answers
    updateAnswer,
    saveAnswers,
    getQuestionAnswer,
    validateCurrentStep,

    // Utilities
    markUnsavedChanges,
  };
};
