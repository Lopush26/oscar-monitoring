// components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

// Button variants using CVA - Refined Elegant
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground px-5 py-2.5 shadow-elegant-sm hover:bg-primary-hover hover:shadow-elegant-md active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground px-5 py-2.5 border border-border/60 hover:bg-secondary/80",
        outline: "border border-border/60 bg-transparent hover:bg-muted px-5 py-2.5",
        ghost: "bg-transparent hover:bg-muted px-5 py-2.5",
        destructive: "bg-destructive text-destructive-foreground px-5 py-2.5 shadow-elegant-sm hover:bg-destructive/90 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-5 py-2.5 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
        iconSm: "h-9 w-9",
        iconLg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={twMerge(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!isLoading && icon && iconPosition === "left" && icon}
        {children}
        {!isLoading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };