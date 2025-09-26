import type { components } from '@app/openapi/generated-types';

// Re-export OpenAPI types for convenience
export type SurveySession = components['schemas']['SurveySession'];
export type Step = components['schemas']['Step'];
export type Answer = components['schemas']['Answer'];
export type Progress = components['schemas']['Progress'];
export type NavigateRequest = components['schemas']['NavigateRequest'];
export type SessionStepResponse = components['schemas']['SessionStepResponse'];

// Client-side stepper state for UI management
export interface StepperState {
  session: SurveySession | null;
  currentStep: Step | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
  hasUnsavedChanges: boolean;
}

// UI-specific navigation helpers
export interface StepNavigationInfo {
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  nextLabel: string;
  previousLabel: string;
}

// Form value types for UI
export type FormAnswerValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, unknown>;

// Stepper actions interface
export interface StepperActions {
  initializeSession: (
    surveyId: string,
    initialAnswers?: Answer[]
  ) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  saveCurrentAnswers: (answers: Answer[]) => Promise<void>;
  navigateToStep: (direction: 'next' | 'previous') => Promise<void>;
  jumpToStep: (stepIndex: number) => Promise<void>;
  resetSession: () => void;
  setAnswer: (questionId: string, value: FormAnswerValue) => void;
  clearError: () => void;
  markUnsavedChanges: (hasChanges: boolean) => void;
}
