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
            className="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm" 
          />

            {/* Modal içeriği */}
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "w-full max-w-md bg-white border-zinc-200 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto", 
                "flex flex-col max-h-[90vh]"
              )}
            >
              {/* header */}
              <div className={cn(
                "flex items-center justify-between p-6 border-b bg-white",
                isDanger ? "border-red-200" : "border-zinc-100"
              )}>
                <h3 className={cn(
                  "text-xl font-bold tracking-tight",
                  isDanger ? "text-red-800" : "text-zinc-800"
                )}>
                  {title}
                </h3>
                <button 
                    onClick={onClose}
                    className={cn(
                      "p-2 rounded-full transition-colors cursor-pointer",
                      isDanger
                        ? "bg-red-100 hover:bg-red-500 text-red-600 hover:text-red-100 hover:scale-90"
                        : "bg-cyan-50 hover:bg-cyan-500 text-cyan-600 hover:text-white hover:scale-90"
                    )}
                >
                    <X size={20} />
                </button>
              </div>

                {/* içerik */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
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