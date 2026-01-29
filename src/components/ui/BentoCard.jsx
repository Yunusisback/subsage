import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const BentoCard = ({ children, className, glowColor = "zinc", ...props }) => {
  const colors = {
    red: { glow: "from-red-500/40 to-transparent" },
    green: { glow: "from-green-500/40 to-transparent" },
    blue: { glow: "from-blue-500/40 to-transparent" },
    orange: { glow: "from-orange-500/40 to-transparent" },
    purple: { glow: "from-purple-500/40 to-transparent" },
    zinc: { glow: "from-zinc-500/30 to-transparent" },
    fuchsia: { glow: "from-fuchsia-500/40 to-transparent" },
    yellow: { glow: "from-yellow-500/40 to-transparent" },
  };

  const activeColor = colors[glowColor] || colors.zinc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden group",
        "rounded-4xl", 
        "flex flex-col",
        "cursor-default",
        "bg-white/70 backdrop-blur-xl border border-white/60", 
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        "hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* glow effect */}
      <div
        className={cn(
          "absolute -top-20 -right-20 w-64 h-64 bg-linear-to-br rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
          activeColor.glow
        )}
      />
      
      {/* İçerik */}
      <div className="relative z-10 w-full h-full flex flex-col">
          {children}
      </div>
    </motion.div>
  );
};

export default BentoCard;