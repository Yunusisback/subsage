import { cn } from "../../utils/helpers";

const StatCard = ({ children, className }) => {
  return (
    <div 
      className={cn(
    
        "relative group rounded-4xl p-6 transition-all duration-500 ease-out h-48 overflow-hidden select-none",
        
     
        "bg-white border border-zinc-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
        
        
        "dark:bg-zinc-900 dark:border-zinc-800/80 dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)]",
        
       
        "hover:-translate-y-1.5 hover:shadow-xl hover:shadow-zinc-200/60 dark:hover:shadow-black/50 hover:border-zinc-200 dark:hover:border-zinc-700",
        
       
        className
      )}
    >
   
      {children}
      

      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export default StatCard;