import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS } from "./testimonials";

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
    <div className="hidden lg:flex w-1/2 h-full bg-zinc-50 relative items-center justify-center p-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-100 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-blue-100/40 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <div className="flex items-center gap-3 mb-10">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500 drop-shadow-sm">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <h1 className="text-4xl font-bold tracking-tight text-cyan-800">SubSage</h1>
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
                <p className="text-4xl font-semibold leading-tight text-zinc-800">
                  "{TESTIMONIALS[currentTestimonial].quote}"
                </p>
              </blockquote>
              
              <footer className="flex items-center gap-4 pt-4">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-12 h-12 bg-white rounded-full border border-zinc-200 p-0.5 shadow-sm"
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
                  <cite className="not-italic font-bold block text-zinc-900">
                    {TESTIMONIALS[currentTestimonial].author}
                  </cite>
                  <span className="text-zinc-500 text-sm font-medium">
                    {TESTIMONIALS[currentTestimonial].role}
                  </span>
                </motion.div>
              </footer>
            </motion.div>
          </AnimatePresence>

      
          <div className="flex items-center justify-center gap-2 mt-8">

         
            {TESTIMONIALS.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'w-8 bg-cyan-500' 
                    : 'w-1.5 bg-zinc-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;