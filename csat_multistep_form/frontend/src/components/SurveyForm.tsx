import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Typography,
} from '@/components';
import { cn } from '@/utils';
import type { Step, Answer, FormAnswerValue } from '@/types';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'rating';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

interface SurveyFormProps {
  step: Step;
  answers: Answer[];
  questions: Question[]; // This would come from the backend/API
  onAnswerChange: (questionId: string, value: FormAnswerValue) => void;
  validationErrors?: Record<string, string>;
  disabled?: boolean;
  className?: string;
}

export const SurveyForm = ({
  step,
  answers,
  questions,
  onAnswerChange,
  validationErrors = {},
  disabled = false,
  className,
}: SurveyFormProps) => {
  const form = useForm();

  // Filter questions for current step
  const stepQuestions = questions.filter(q => step.questionIds.includes(q.id));

  // Convert answers to form values
  const formValues = answers.reduce(
    (acc, answer) => {
      acc[answer.questionId] = answer.value;
      return acc;
    },
    {} as Record<string, FormAnswerValue>
  );

  // Update form when answers change
  useEffect(() => {
    Object.entries(formValues).forEach(([questionId, value]) => {
      form.setValue(questionId, value);
    });
  }, [form, formValues]);

  const renderQuestion = (question: Question) => {
    const hasError = validationErrors[question.id];

    switch (question.type) {
      case 'text':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  {question.text}
                  {question.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={question.placeholder}
                    disabled={disabled}
                    {...field}
                    onChange={e => {
                      field.onChange(e);
                      onAnswerChange(question.id, e.target.value);
                    }}
                    className={cn(hasError && 'border-destructive')}
                  />
                </FormControl>
                {hasError && (
                  <Typography.Small className="text-destructive">
                    {validationErrors[question.id]}
                  </Typography.Small>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'textarea':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  {question.text}
                  {question.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={question.placeholder}
                    disabled={disabled}
                    rows={4}
                    {...field}
                    onChange={e => {
                      field.onChange(e);
                      onAnswerChange(question.id, e.target.value);
                    }}
                    className={cn(hasError && 'border-destructive')}
                  />
                </FormControl>
                {hasError && (
                  <Typography.Small className="text-destructive">
                    {validationErrors[question.id]}
                  </Typography.Small>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  {question.text}
                  {question.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={value => {
                    field.onChange(value);
                    onAnswerChange(question.id, value);
                  }}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(hasError && 'border-destructive')}
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {question.options?.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasError && (
                  <Typography.Small className="text-destructive">
                    {validationErrors[question.id]}
                  </Typography.Small>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'radio':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  {question.text}
                  {question.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={value => {
                      field.onChange(value);
                      onAnswerChange(question.id, value);
                    }}
                    disabled={disabled}
                    className="space-y-2"
                  >
                    {question.options?.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`${question.id}-${option}`}
                        />
                        <label
                          htmlFor={`${question.id}-${option}`}
                          className="text-sm font-normal"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {hasError && (
                  <Typography.Small className="text-destructive">
                    {validationErrors[question.id]}
                  </Typography.Small>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'checkbox':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  {question.text}
                  {question.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {question.options?.map(option => {
                      const isChecked =
                        Array.isArray(field.value) &&
                        field.value.includes(option);
                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${question.id}-${option}`}
                            checked={isChecked}
                            onCheckedChange={checked => {
                              const currentValues = Array.isArray(field.value)
                                ? field.value
                                : [];
                              let newValues;
                              if (checked) {
                                newValues = [...currentValues, option];
                              } else {
                                newValues = currentValues.filter(
                                  (v: string) => v !== option
                                );
                              }
                              field.onChange(newValues);
                              onAnswerChange(question.id, newValues);
                            }}
                            disabled={disabled}
                          />
                          <label
                            htmlFor={`${question.id}-${option}`}
                            className="text-sm font-normal"
                          >
                            {option}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </FormControl>
                {hasError && (
                  <Typography.Small className="text-destructive">
                    {validationErrors[question.id]}
                  </Typography.Small>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'rating':
        return (
          <FormField
            key={question.id}
            control={form.control}
            name={question.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  {question.text}
                  {question.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => {
                          field.onChange(rating);
                          onAnswerChange(question.id, rating);
                        }}
                        disabled={disabled}
                        className={cn(
                          'p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                          field.value >= rating
                            ? 'text-yellow-500'
                            : 'text-gray-300 hover:text-gray-400'
                        )}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </FormControl>
                {hasError && (
                  <Typography.Small className="text-destructive">
                    {validationErrors[question.id]}
                  </Typography.Small>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Step Header */}
          <div className="text-center">
            <Typography.H2>{step.title}</Typography.H2>
            {step.description && (
              <Typography.P className="text-muted-foreground mt-2">
                {step.description}
              </Typography.P>
            )}
          </div>

          {/* Questions */}
          <Form {...form}>
            <div className="space-y-6">{stepQuestions.map(renderQuestion)}</div>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
