import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "success"
    | "warning";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variantClasses = {
      default:
        "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 focus-visible:ring-emerald-500 shadow-md shadow-emerald-500/20 hover:shadow-lg rounded-xl",
      destructive:
        "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 focus-visible:ring-red-500 shadow-md shadow-red-500/20 rounded-xl",
      outline:
        "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-emerald-300 hover:text-emerald-700 focus-visible:ring-emerald-500 rounded-xl",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 rounded-xl",
      ghost:
        "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 rounded-xl",
      link:
        "text-emerald-600 underline-offset-4 hover:underline",
      success:
        "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 focus-visible:ring-emerald-500 shadow-md shadow-emerald-500/20 rounded-xl",
      warning:
        "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 focus-visible:ring-amber-500 shadow-md shadow-amber-500/20 rounded-xl",
    };

    const sizeClasses = {
      default: "h-11 py-2.5 px-5 text-sm",
      sm: "h-9 px-3.5 text-sm rounded-lg",
      lg: "h-12 px-8 text-base rounded-xl",
      icon: "h-10 w-10 rounded-xl",
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
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
