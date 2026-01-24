import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const BentoCard = ({ children, className, glowColor = "zinc", ...props }) => {
  

  const colorMap = {
    red:    "from-red-500 to-red-900/10 group-hover:border-red-500/50",
    green:  "from-green-500 to-green-900/10 group-hover:border-green-500/50",
    blue:   "from-blue-500 to-blue-900/60 group-hover:border-blue-500/50",
    orange: "from-orange-600 to-orange-900/80 group-hover:border-orange-500/50",
    purple: "from-purple-500 to-purple-900/40 group-hover:border-purple-500/50",
    zinc:   "from-zinc-500 to-zinc-900/10 group-hover:border-zinc-500/30",
    fuchsia: "from-fuchsia-500 to-fuchsia-900/10 group-hover:border-fuchsia-500/50",
    yellow: "from-yellow-500 to-yellow-900/10 group-hover:border-yellow-500/50",
  };

  // Seçilen rengi al yoksa varsayılan zinc olsun
  const selectedColorClass = colorMap[glowColor] || colorMap.zinc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden group",
        "bg-card-bg", 
        "rounded-4xl",  
        "border border-white/5", 
        "shadow-2xl shadow-black/80",
        "flex flex-col items-center justify-center text-center p-6",
        "cursor-pointer transition-all duration-300",

        selectedColorClass.split(" ").pop(), 
        className
      )}
      {...props}
    >
       {/* glow efekti */}
       <div 
         className={cn(
           "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
           "w-56 h-56 rounded-full", 
           "blur-[80px]", 
           "opacity-60 group-hover:opacity-90", 
           "transition-opacity duration-500 bg-linear-to-tr",
  
           selectedColorClass.split(" group")[0]
         )} 
       />
       
       {/* cam yanısması */}
       <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

       {/* İçerik */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default BentoCard;