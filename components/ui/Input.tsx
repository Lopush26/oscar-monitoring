// components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  tabular?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      type = 'text',
      tabular = false,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'h-9 px-3.5 text-sm',
      md: 'h-11 px-4 text-base',
      lg: 'h-12 px-5 text-lg',
    };

    const baseStyles = [
      'w-full rounded-xl border',
      'bg-background',
      'text-foreground',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
      'transition-all duration-200 ease-out',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeStyles[inputSize],
      tabular && 'tabular-nums font-variant-numeric-[tabular-nums]',
    ];

    const errorStyles = error
      ? 'border-destructive focus:ring-destructive/30 focus:border-destructive'
      : 'border-input hover:border-border/80';

    const withLeftIcon = leftIcon ? 'pl-11' : '';
    const withRightIcon = rightIcon ? 'pr-11' : '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="label"
          >
            {label}
            {props.required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              baseStyles,
              errorStyles,
              withLeftIcon,
              withRightIcon,
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${props.id}-error`} className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };