import { Progress, Typography } from '@/components';
import { cn } from '@/utils';
import type { Step, Progress as ProgressType } from '@/types';

interface StepProgressBarProps {
  steps: Step[];
  currentStepIndex: number;
  progress: ProgressType;
  onStepClick?: (stepIndex: number) => void;
  showLabels?: boolean;
  className?: string;
}

export const StepProgressBar = ({
  steps,
  currentStepIndex,
  progress,
  onStepClick,
  showLabels = true,
  className,
}: StepProgressBarProps) => {
  const handleStepClick = (stepIndex: number) => {
    if (onStepClick && stepIndex <= progress.completedSteps) {
      onStepClick(stepIndex);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress Header */}
      <div className="flex justify-between items-center">
        <Typography.Large>
          Step {currentStepIndex + 1} of {steps.length}
        </Typography.Large>
        <Typography.Small className="text-muted-foreground">
          {Math.round(progress.percentage)}% Complete
        </Typography.Small>
      </div>

      {/* Progress Bar */}
      <Progress value={progress.percentage} className="h-2" />

      {/* Step Indicators */}
      {showLabels && steps.length > 1 && (
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < progress.completedSteps;
            const isClickable =
              onStepClick && (isCompleted || index <= progress.completedSteps);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center space-y-2 text-center transition-colors',
                  'min-w-0 flex-1 px-2',
                  isClickable && 'cursor-pointer hover:text-primary',
                  !isClickable && 'cursor-not-allowed',
                  isActive && 'text-primary font-medium',
                  isCompleted && !isActive && 'text-muted-foreground',
                  !isCompleted && !isActive && 'text-muted-foreground/60'
                )}
              >
                {/* Step Number/Status */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    isActive && 'bg-primary text-primary-foreground',
                    isCompleted &&
                      !isActive &&
                      'bg-muted text-muted-foreground',
                    !isCompleted &&
                      !isActive &&
                      'bg-muted/50 text-muted-foreground/60'
                  )}
                >
                  {isCompleted && !isActive ? '✓' : index + 1}
                </div>

                {/* Step Title */}
                <Typography.Small
                  className={cn(
                    'truncate max-w-full transition-colors',
                    isActive && 'text-primary font-medium',
                    isCompleted && !isActive && 'text-muted-foreground',
                    !isCompleted && !isActive && 'text-muted-foreground/60'
                  )}
                  title={step.title}
                >
                  {step.title}
                </Typography.Small>

                {/* Step Description (optional) */}
                {step.description && (
                  <Typography.Small className="text-muted-foreground/80 truncate max-w-full">
                    {step.description}
                  </Typography.Small>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
