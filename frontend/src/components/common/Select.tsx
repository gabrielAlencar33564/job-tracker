import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export function Select({
  label,
  error,
  options,
  className = "",
  id,
  ...props
}: SelectProps) {
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
        <select
          id={id}
          className={`
            w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 font-medium 
            outline-none transition-all appearance-none cursor-pointer leading-tight
            focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500 bg-rose-50/10" : ""}
          `}
          {...props}
        >
          <option value="" disabled hidden>
            Selecione uma opção
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
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
