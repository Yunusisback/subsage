import TestimonialCarousel from "./TestimonialCarousel";
import AuthForm from "./AuthForm";
import { useUI } from "../../context/UIContext";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const AuthPage = () => {

  const { darkMode, toggleDarkMode } = useUI();

  return (
    <div className="flex h-screen w-full relative bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-cyan-100 selection:text-cyan-900 dark:selection:bg-cyan-900 dark:selection:text-cyan-100 overflow-hidden">
      
     
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer active:scale-95"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      <TestimonialCarousel />
      <AuthForm />
    </div>
  );
};

export default AuthPage;