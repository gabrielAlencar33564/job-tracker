import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon: Icon, className = "", id, ...props }: InputProps) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
            {Icon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 font-medium 
            outline-none transition-all placeholder:text-slate-300
            focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? "pl-11" : ""}
            ${error ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500 bg-rose-50/10" : ""}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-bold text-rose-600 mt-1 ml-1 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-rose-600"></span>
          {error}
        </p>
      )}
    </div>
  );
}
