import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/helpers";


const Modal = ({ isOpen, onClose, title, children, variant = "default" }) => {
  
  const isDanger = variant === "danger";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
        document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
    
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/30 dark:bg-black/60 backdrop-blur-sm" 
          />

            {/* Modal içeriği */}
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto", 
                "flex flex-col max-h-[90vh]",
                "bg-white dark:bg-zinc-900",
                "border border-zinc-100 dark:border-zinc-800",
                "shadow-zinc-200/60 dark:shadow-black/60"
              )}
            >
              {/* header */}
              <div className={cn(
                "flex items-center justify-between p-6 border-b",
                "bg-white dark:bg-zinc-900/80",
                isDanger 
                  ? "border-red-200 dark:border-red-900/40" 
                  : "border-zinc-100 dark:border-zinc-800"
              )}>
                <h3 className={cn(
                  "text-xl font-bold tracking-tight",
                  isDanger 
                    ? "text-red-800 dark:text-red-400" 
                    : "text-zinc-800 dark:text-zinc-100"
                )}>
                  {title}
                </h3>
                <button 
                    onClick={onClose}
                    className={cn(
                      "p-2 rounded-full transition-all duration-200 cursor-pointer",
                      isDanger
                        ? "bg-red-100 dark:bg-red-900/30 hover:bg-red-500 dark:hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white hover:scale-90"
                        : "bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-500 dark:hover:bg-cyan-600 text-cyan-600 dark:text-cyan-400 hover:text-white hover:scale-90"
                    )}
                >
                    <X size={20} />
                </button>
              </div>

                {/* içerik */}
              <div className="p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-900">
                {children}
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;