import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const BentoCard = ({ children, className, glowColor = "zinc", ...props }) => {
  const colors = {
    red: {
      glow: "from-red-500/50 to-transparent",
    },
    green: {
      glow: "from-green-500/50 to-transparent",
    },
    blue: {
      glow: "from-blue-500/50 to-transparent",
    },
    orange: {
      glow: "from-orange-500/50 to-transparent",
    },
    purple: {
      glow: "from-purple-500/50 to-transparent",
    },
    zinc: {
      glow: "from-zinc-500/40 to-transparent",
    },
    fuchsia: {
      glow: "from-fuchsia-500/50 to-transparent",
    },
    yellow: {
      glow: "from-yellow-500/50 to-transparent",
    },
  };

  const activeColor = colors[glowColor] || colors.zinc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
      className={cn(
        "relative overflow-hidden group",
        "rounded-3xl",
        "flex flex-col items-center justify-center text-center p-8",
        "cursor-pointer",
        "bg-white",
        "shadow-md",
        "group-hover:shadow-2xl",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-48 -right-48",
          "w-125 h-125 rounded-full",
          "blur-[120px]",
          "opacity-80 group-hover:opacity-100",
          "transition-opacity duration-400 ease-in-out",
          "bg-linear-to-bl",
          activeColor.glow
        )}
      />

      {/* İçerik */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default BentoCard;