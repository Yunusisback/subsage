import { cn } from "../../utils/helpers";

const StatCard = ({ children, className }) => {
  return (
    <div 
      className={cn(
        "relative group bg-white rounded-4xl p-6 border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.20)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-48 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

export default StatCard;