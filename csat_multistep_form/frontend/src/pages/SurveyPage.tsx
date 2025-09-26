import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Container, Alert, AlertDescription, Typography } from '@/components';
import type { FormAnswerValue } from '@/types';
import { StepProgressBar } from '../components/StepProgressBar';
import { StepNavigation } from '../components/StepNavigation';
import { SurveyForm } from '../components/SurveyForm';
import { useSurveyStepper } from '@/hooks';

// Mock questions - in real implementation, this would come from the API
const mockQuestions = [
  {
    id: 'satisfaction',
    text: 'Overall, how satisfied are you with our service?',
    type: 'rating' as const,
    required: true,
  },
  {
    id: 'usage-frequency',
    text: 'How often do you use our product?',
    type: 'select' as const,
    options: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
    required: true,
  },
  {
    id: 'feature-request',
    text: 'What is one feature you would like to see added?',
    type: 'text' as const,
    placeholder: 'Describe the feature...',
    required: false,
  },
  {
    id: 'feedback',
    text: 'Do you have any other comments or suggestions?',
    type: 'textarea' as const,
    placeholder: 'Your feedback is valuable...',
    required: false,
  },
  {
    id: 'recommend',
    text: 'Would you recommend our product to others?',
    type: 'radio' as const,
    options: [
      'Definitely',
      'Probably',
      'Not sure',
      'Probably not',
      'Definitely not',
    ],
    required: true,
  },
  {
    id: 'contact-preference',
    text: 'How would you prefer to be contacted? (Select all that apply)',
    type: 'checkbox' as const,
    options: ['Email', 'Phone', 'SMS', 'In-app notification'],
    required: false,
  },
];

export const SurveyPage = () => {
  const { surveyId, sessionId } = useParams<{
    surveyId: string;
    sessionId?: string;
  }>();

  const {
    session,
    currentStep,
    isLoading,
    isSubmitting,
    error,
    validationErrors,
    progress,
    navigationInfo,
    currentStepAnswers,
    goNext,
    goPrevious,
    goToStep,
    updateAnswer,
    saveAnswers,
    canProceedToNext,
  } = useSurveyStepper({
    surveyId: surveyId || '',
    sessionId,
    autoInitialize: !!surveyId,
  });

  // Auto-save answers when they change (debounced in real implementation)
  const handleAnswerChange = (questionId: string, value: unknown) => {
    updateAnswer(questionId, value as FormAnswerValue);
    // In a real implementation, you might debounce this save call
    setTimeout(() => {
      saveAnswers();
    }, 1000);
  };

  const handleNext = async () => {
    if (navigationInfo.isLastStep) {
      // Final submission
      await saveAnswers();
      // Navigate to completion page or show success message
    } else {
      await goNext();
    }
  };

  const handlePrevious = async () => {
    await goPrevious();
  };

  const handleStepClick = async (stepIndex: number) => {
    await goToStep(stepIndex);
  };

  if (isLoading && !session) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <Typography.Large>Loading survey...</Typography.Large>
        </div>
      </Container>
    );
  }

  if (error && !session) {
    return (
      <Container>
        <Alert variant="destructive">
          <AlertDescription>Failed to load survey: {error}</AlertDescription>
        </Alert>
      </Container>
    );
  }

  if (!session || !currentStep) {
    return (
      <Container>
        <Alert>
          <AlertDescription>
            Survey session not found. Please check the survey link.
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Survey - Step {session.currentStepIndex + 1} of {session.steps.length}
        </title>
      </Helmet>

      <Container className="max-w-2xl py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <Typography.H1>Customer Satisfaction Survey</Typography.H1>
            <Typography.P className="text-muted-foreground mt-2">
              Your feedback helps us improve.
            </Typography.P>
          </div>

          {/* Progress Bar */}
          <StepProgressBar
            steps={session.steps}
            currentStepIndex={session.currentStepIndex}
            progress={progress}
            onStepClick={handleStepClick}
            showLabels={true}
          />

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Survey Form */}
          <SurveyForm
            step={currentStep}
            answers={currentStepAnswers}
            questions={mockQuestions}
            onAnswerChange={handleAnswerChange}
            validationErrors={validationErrors}
            disabled={isSubmitting}
          />

          {/* Navigation */}
          <StepNavigation
            navigationInfo={navigationInfo}
            onPrevious={handlePrevious}
            onNext={handleNext}
            disabled={!canProceedToNext()}
            isLoading={isSubmitting}
          />

          {/* Footer Info */}
          <div className="text-center">
            <Typography.Small className="text-muted-foreground">
              Your progress is automatically saved as you complete each step.
            </Typography.Small>
          </div>
        </div>
      </Container>
    </>
  );
};
