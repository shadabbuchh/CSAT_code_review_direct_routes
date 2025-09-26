import { create } from 'zustand';
import { post, put, handleError } from '@/apis';
import type {
  StepperState,
  StepperActions,
  Answer,
  FormAnswerValue,
  StepNavigationInfo,
} from '@/types';

interface StepperStore extends StepperState, StepperActions {
  // Computed selectors
  getNavigationInfo: () => StepNavigationInfo;
  getCurrentStepAnswers: () => Answer[];
  getAnswerValue: (questionId: string) => FormAnswerValue | undefined;
}

const initialState: StepperState = {
  session: null,
  currentStep: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  validationErrors: {},
  hasUnsavedChanges: false,
};

export const useStepperStore = create<StepperStore>((set, getState) => ({
  ...initialState,

  initializeSession: async (surveyId: string, initialAnswers?: Answer[]) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await post('/survey-sessions', {
        body: {
          surveyId,
          initialAnswers,
        },
      });

      if (error) {
        handleError(error);
        set({ error: 'Failed to create survey session', isLoading: false });
        return;
      }

      if (data) {
        set({
          session: data,
          currentStep: data.steps[data.currentStepIndex] || null,
          isLoading: false,
          hasUnsavedChanges: false,
        });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  loadSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Mock implementation for now - replace with actual API call when available
      // const { data, error } = await get('/survey-sessions/{sessionId}', {
      //   params: { path: { sessionId } },
      // });

      // For now, set a mock error since the API endpoint doesn't exist yet
      set({ error: 'Session loading not implemented yet', isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  saveCurrentAnswers: async (answers: Answer[]) => {
    const { session } = getState();
    if (!session) return;

    set({ isSubmitting: true, error: null });

    try {
      const { data, error } = await put(
        '/survey-sessions/{sessionId}/steps/{stepIndex}',
        {
          params: {
            path: {
              sessionId: session.id,
              stepIndex: session.currentStepIndex,
            },
          },
          body: {
            answers,
            preserveOtherSteps: true,
          },
        }
      );

      if (error) {
        handleError(error);
        set({ error: 'Failed to save answers', isSubmitting: false });
        return;
      }

      if (data) {
        set({
          session: data,
          currentStep: data.steps[data.currentStepIndex] || null,
          isSubmitting: false,
          hasUnsavedChanges: false,
        });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        isSubmitting: false,
      });
    }
  },

  navigateToStep: async (direction: 'next' | 'previous') => {
    const { session } = getState();
    if (!session) return;

    set({ isLoading: true, error: null });

    try {
      const { data, error } = await post(
        '/survey-sessions/{sessionId}/navigate',
        {
          params: { path: { sessionId: session.id } },
          body: {
            direction,
            validateCurrentStep: true,
          },
        }
      );

      if (error) {
        handleError(error);
        set({ error: 'Failed to navigate', isLoading: false });
        return;
      }

      if (data) {
        set({
          session: data,
          currentStep: data.steps[data.currentStepIndex] || null,
          isLoading: false,
          hasUnsavedChanges: false,
        });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  jumpToStep: async (stepIndex: number) => {
    const { session } = getState();
    if (!session || stepIndex < 0 || stepIndex >= session.steps.length) return;

    set({ isLoading: true, error: null });

    try {
      // Navigate step by step to the target
      const currentIndex = session.currentStepIndex;
      const direction = stepIndex > currentIndex ? 'next' : 'previous';
      let iterations = Math.abs(stepIndex - currentIndex);

      let updatedSession = session;
      while (iterations > 0) {
        const { data, error } = await post(
          '/survey-sessions/{sessionId}/navigate',
          {
            params: { path: { sessionId: updatedSession.id } },
            body: { direction },
          }
        );

        if (error) {
          handleError(error);
          set({ error: 'Failed to navigate', isLoading: false });
          return;
        }

        if (data) {
          updatedSession = data;
        }
        iterations--;
      }

      set({
        session: updatedSession,
        currentStep:
          updatedSession.steps[updatedSession.currentStepIndex] || null,
        isLoading: false,
        hasUnsavedChanges: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  resetSession: () => {
    set(initialState);
  },

  setAnswer: (questionId: string, value: FormAnswerValue) => {
    const { session } = getState();
    if (!session) return;

    const updatedAnswers = [...(session.answers || [])];
    const existingIndex = updatedAnswers.findIndex(
      a => a.questionId === questionId
    );

    const answer: Omit<Answer, 'value'> & { value: FormAnswerValue } = {
      questionId,
      value,
      stepId: session.steps[session.currentStepIndex]?.id,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = answer as Answer;
    } else {
      updatedAnswers.push(answer as Answer);
    }

    set({
      session: { ...session, answers: updatedAnswers },
      hasUnsavedChanges: true,
    });
  },

  clearError: () => {
    set({ error: null, validationErrors: {} });
  },

  markUnsavedChanges: (hasChanges: boolean) => {
    set({ hasUnsavedChanges: hasChanges });
  },

  getNavigationInfo: (): StepNavigationInfo => {
    const { session } = getState();
    if (!session) {
      return {
        isFirstStep: true,
        isLastStep: true,
        canGoNext: false,
        canGoPrevious: false,
        nextLabel: 'Next',
        previousLabel: 'Previous',
      };
    }

    const isFirstStep = session.currentStepIndex === 0;
    const isLastStep = session.currentStepIndex === session.steps.length - 1;

    return {
      isFirstStep,
      isLastStep,
      canGoNext: !isLastStep,
      canGoPrevious: !isFirstStep,
      nextLabel: isLastStep ? 'Submit' : 'Next',
      previousLabel: 'Previous',
    };
  },

  getCurrentStepAnswers: (): Answer[] => {
    const { session, currentStep } = getState();
    if (!session || !currentStep) return [];

    return (session.answers || []).filter(answer =>
      currentStep.questionIds.includes(answer.questionId)
    );
  },

  getAnswerValue: (questionId: string): FormAnswerValue | undefined => {
    const { session } = getState();
    if (!session) return undefined;

    const answer = (session.answers || []).find(
      a => a.questionId === questionId
    );
    return answer?.value as FormAnswerValue;
  },
}));
