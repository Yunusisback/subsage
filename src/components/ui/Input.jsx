import { cn } from "../../utils/helpers";

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={cn(
            "w-full bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 rounded-xl px-4 py-3 border border-zinc-200 dark:border-zinc-700", 
            "focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20",
            "placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all duration-300",
            error ? "border-red-500/50 focus:border-red-500" : "hover:border-zinc-300 dark:hover:border-zinc-600",
            className
          )}
          {...props}
        />
     
        <div className="absolute inset-0 rounded-xl bg-cyan-400/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500" />
      </div>
      {error && (
        <span className="text-xs text-red-500 ml-1 block animate-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;