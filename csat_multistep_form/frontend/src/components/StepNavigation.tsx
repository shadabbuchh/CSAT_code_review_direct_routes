import { Button } from '@/components';
import { cn } from '@/utils';
import type { StepNavigationInfo } from '@/types';

interface StepNavigationProps {
  navigationInfo: StepNavigationInfo;
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const StepNavigation = ({
  navigationInfo,
  onPrevious,
  onNext,
  disabled = false,
  isLoading = false,
  className,
}: StepNavigationProps) => {
  const { isLastStep, canGoNext, canGoPrevious, nextLabel, previousLabel } =
    navigationInfo;

  return (
    <div className={cn('flex justify-between pt-6', className)}>
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious || disabled || isLoading}
        className={cn(!canGoPrevious && 'invisible')}
      >
        {previousLabel}
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || disabled || isLoading}
        variant={isLastStep ? 'default' : 'default'}
      >
        {isLoading ? 'Loading...' : nextLabel}
      </Button>
    </div>
  );
};
