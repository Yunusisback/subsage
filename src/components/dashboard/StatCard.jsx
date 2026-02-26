import { cn } from "../../utils/helpers";

const StatCard = ({ children, className }) => {
  return (
    <div 
      className={cn(
        "relative group bg-white dark:bg-zinc-800 rounded-4xl p-6 border border-slate-100 dark:border-zinc-700 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.20)] dark:shadow-[0_2px_20px_-5px_rgba(0,0,0,0.5)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-48 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

export default StatCard;