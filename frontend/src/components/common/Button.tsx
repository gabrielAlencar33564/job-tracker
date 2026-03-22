import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  isLoading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 focus:ring-blue-500/20",
    secondary: "bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 focus:ring-slate-100",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 focus:ring-rose-500/20",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-800 focus:ring-slate-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon}
          {children}
        </>
      )}
    </button>
  );
}
