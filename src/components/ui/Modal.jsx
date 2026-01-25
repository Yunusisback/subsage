import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/helpers";

const Modal = ({ isOpen, onClose, title, children }) => {
  

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

          {/* Modal İçeriği */}
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "w-full max-w-md bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto", 
                "flex flex-col max-h-[90vh]"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-white">
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h3>
                <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer" 
                >
                    <X size={20} />
                </button>
              </div>

              {/* body */}
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