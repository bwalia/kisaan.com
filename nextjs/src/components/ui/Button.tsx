import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", loading, disabled, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";

    const v: Record<string, string> = {
      default: "bg-[var(--pine)] text-white hover:bg-[var(--pine-dark)] focus-visible:ring-[var(--pine)]",
      destructive: "bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-600",
      outline: "border border-[var(--border)] bg-white text-[var(--soil)] hover:bg-[var(--surface)] focus-visible:ring-[var(--pine)]",
      secondary: "bg-[var(--surface)] text-[var(--soil)] hover:bg-[var(--border)] focus-visible:ring-[var(--pine)]",
      ghost: "text-[var(--soil)] hover:bg-[var(--surface)] focus-visible:ring-[var(--pine)]",
      link: "text-[var(--pine)] underline-offset-4 hover:underline p-0 h-auto",
      success: "bg-[var(--pine)] text-white hover:bg-[var(--pine-dark)] focus-visible:ring-[var(--pine)]",
      warning: "bg-[var(--marigold)] text-white hover:opacity-90 focus-visible:ring-[var(--marigold)]",
    };

    const s: Record<string, string> = {
      default: "h-10 py-2 px-4 text-sm",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button className={`${base} ${v[variant]} ${s[size]} ${className}`} ref={ref} disabled={disabled || loading} {...props}>
        {loading && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
