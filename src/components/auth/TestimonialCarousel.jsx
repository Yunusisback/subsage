import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS } from "./testimonials";

const BRANDS = [
  "/brands/apple.svg",
  "/brands/amazon.svg",
  "/brands/netflix.svg",
  "/brands/spotify.svg",
  "/brands/youtube.svg",
  "/brands/discord.svg",
  "/brands/playstation.svg",
  "/brands/xbox.svg",
  "/brands/adobe.svg",
  "/brands/canva.svg",
];

const TestimonialCarousel = () => {
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000); 

    return () => clearInterval(timer);
  }, [currentTestimonial]);

 
  const handleNext = () => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 h-full bg-zinc-50 dark:bg-zinc-900 relative p-12 lg:p-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-100 dark:bg-cyan-900/30 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-[100px] opacity-40"></div>
      </div>

     
      <div className="relative z-10 max-w-lg w-full mt-7 ml-6">
        
        
        <div className="flex items-center gap-3 mb-15">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500 drop-shadow-sm">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <h1 className="text-4xl font-bold tracking-tight text-cyan-800 dark:text-cyan-400">SubSage</h1>
        </div>
        
         
        <div className="relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentTestimonial}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              <blockquote>
                <p className="text-4xl font-semibold leading-tight text-zinc-800 dark:text-zinc-100">
                  "{TESTIMONIALS[currentTestimonial].quote}"
                </p>
              </blockquote>
              
              <footer className="flex items-center gap-4 pt-4">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 p-0.5 shadow-sm"
                >
                  <img 
                    src={TESTIMONIALS[currentTestimonial].avatar} 
                    alt={TESTIMONIALS[currentTestimonial].author} 
                    className="w-full h-full rounded-full object-cover grayscale opacity-80" 
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <cite className="not-italic font-bold block text-zinc-900 dark:text-zinc-100">
                    {TESTIMONIALS[currentTestimonial].author}
                  </cite>
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                    {TESTIMONIALS[currentTestimonial].role}
                  </span>
                </motion.div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    
      <div className="relative w-full overflow-hidden mt-auto pb-4 opacity-60 hover:opacity-75 transition-opacity duration-300 z-10">
     
        <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-zinc-50 dark:from-zinc-900 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-zinc-50 dark:from-zinc-900 to-transparent z-20 pointer-events-none"></div>
        
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 35 
          }}
          className="flex items-center w-max gap-16 pr-16"
        >
          {/* logolarin ilk seti */}
          {BRANDS.map((brand, i) => (
            <img 
              key={`brand-1-${i}`} 
              src={brand} 
              alt="Sponsor Logo" 
              className="h-8 w-auto object-contain grayscale mix-blend-multiply dark:mix-blend-screen dark:opacity-50" 
            />
          ))}
        
          {BRANDS.map((brand, i) => (
            <img 
              key={`brand-2-${i}`} 
              src={brand} 
              alt="Sponsor Logo" 
              className="h-8 w-auto object-contain grayscale mix-blend-multiply dark:mix-blend-screen dark:opacity-50" 
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;