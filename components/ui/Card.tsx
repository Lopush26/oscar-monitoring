// components/ui/Card.tsx
import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'bordered' | 'elevated';
  accent?: 'none' | 'blue' | 'emerald' | 'amber' | 'red' | 'violet' | 'teal';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', accent = 'none', ...props }, ref) => {
    const baseStyles = "rounded-2xl bg-card border border-border/60 transition-all duration-300 ease-out";
    
    const variantStyles = {
      default: "shadow-elegant",
      hover: "shadow-elegant hover:shadow-elegant-hover hover:-translate-y-0.5",
      bordered: "shadow-sm",
      elevated: "shadow-elegant-hover",
    };

    const accentStyles = {
      none: "",
      blue: "border-l-4 border-l-[#3B72B4]",
      emerald: "border-l-4 border-l-[#15803D]",
      amber: "border-l-4 border-l-[#B45309]",
      red: "border-l-4 border-l-[#B91C1C]",
      violet: "border-l-4 border-l-[#7C3AED]",
      teal: "border-l-4 border-l-[#0D9488]",
    };

    // Top highlight border is handled via CSS in globals.css

    return (
      <div
        ref={ref}
        className={twMerge(baseStyles, variantStyles[variant], accentStyles[accent], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge("px-6 py-5 border-b border-border/50", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLParagraphElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={twMerge("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={twMerge("text-sm text-muted-foreground mt-1.5", className)}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={twMerge("p-6", className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge("px-6 py-4 border-t border-border/50 bg-muted/30 rounded-b-2xl", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };