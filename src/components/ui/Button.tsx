import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "orange" | "outline" | "ghost" | "sky";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-primary shadow-sm shadow-blue-900/15",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400 border border-slate-200",
      accent:
        "bg-brand-secondary text-white hover:bg-brand-primary focus:ring-brand-secondary shadow-sm shadow-blue-600/20",
      orange: // Alias untuk backward compatibility, sekarang menggunakan brand-secondary (#307FE3) yang dinamis
        "bg-brand-secondary text-white hover:bg-brand-primary focus:ring-brand-secondary shadow-sm shadow-blue-600/20",
      sky:
        "bg-brand-accent text-slate-900 hover:bg-brand-secondary hover:text-white focus:ring-brand-accent shadow-sm",
      outline:
        "bg-transparent text-brand-primary border-2 border-brand-primary hover:bg-brand-light focus:ring-brand-primary",
      ghost:
        "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-2 min-h-[38px] gap-1.5",
      md: "text-sm px-4 py-2.5 min-h-[44px] gap-2", // Min 44px untuk sentuhan jari di HP (WCAG)
      lg: "text-base px-6 py-3.5 min-h-[50px] gap-2.5 font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";