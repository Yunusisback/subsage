import { cn } from "../../utils/helpers";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  isLoading, 
  ...props 
}) => {
  
  const variants = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.3)] border-transparent",
    secondary: "bg-white/10 text-white hover:bg-white/20 border-white/5",
    outline: "bg-transparent border-white/20 text-zinc-300 hover:border-yellow-400 hover:text-yellow-400",
    danger: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 border-transparent"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-0 flex items-center justify-center"
  };

  return (
    <button 
      className={cn(
        "relative inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
         <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;