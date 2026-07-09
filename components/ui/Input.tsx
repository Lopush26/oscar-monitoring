// components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Omit 'size' from native input to avoid conflict
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
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
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const baseStyles = [
      'w-full rounded-lg border',
      'bg-slate-950',
      'text-slate-100',
      'placeholder:text-slate-500',
      'focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-transparent',
      'transition duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'read-only:bg-slate-900',
      sizeStyles[inputSize],
    ];

    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-slate-800';

    const withLeftIcon = leftIcon ? 'pl-10' : '';
    const withRightIcon = rightIcon ? 'pr-10' : '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${props.id}-error`} className="mt-1.5 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };