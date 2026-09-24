import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const v: Record<string, string> = {
      default: "bg-[var(--field)] text-white hover:bg-[var(--field-dark)] focus-visible:ring-[var(--field)]",
      destructive: "bg-[var(--tomato)] text-white hover:bg-[var(--tomato-dark)] focus-visible:ring-[var(--tomato)]",
      outline: "border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--limewash)] focus-visible:ring-[var(--field)]",
      secondary: "bg-[var(--color-muted)] text-[var(--ink)] hover:bg-[var(--line)] focus-visible:ring-[var(--field)]",
      ghost: "text-[var(--ink)] hover:bg-[var(--color-muted)] focus-visible:ring-[var(--field)]",
      link: "text-[var(--field)] underline-offset-4 hover:underline p-0 h-auto",
      success: "bg-[var(--field)] text-white hover:bg-[var(--field-dark)] focus-visible:ring-[var(--field)]",
      warning: "bg-[var(--mustard)] text-[var(--ink)] hover:opacity-90 focus-visible:ring-[var(--mustard)]",
    };

    const s: Record<string, string> = {
      default: "h-10 py-2 px-4 text-sm",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={`${base} ${v[variant]} ${s[size]} ${className}`}
        ref={ref}
        disabled={disabled || loading}
        style={variant === "default" || variant === "destructive" || variant === "success" ? { color: "#FFFFFF" } : undefined}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
