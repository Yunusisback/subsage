/**
 * SubSage SaaS Dashboard
 * * @author Yunusisback <
 * @copyright 2026 Yunusisback
 * @license Proprietary - No License (See LICENSE file)
 * * 🛑 NOTICE: This source code is protected by copyright laws. 
 * Unauthorized use, reproduction, or distribution is prohibited.
 * Bu kodun izinsiz ticari kullanımı yasaktır.
 */

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; 
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header"; 
import DashboardView from "./components/dashboard/DashboardView"; 
import SubscriptionList from "./components/dashboard/SubscriptionList"; 
import WalletView from "./components/dashboard/WalletView"; 
import SummaryChart from "./components/dashboard/SummaryChart"; 
import Messages from "./components/dashboard/Messages"; 
import Notifications from "./components/dashboard/Notifications"; 
import Settings from "./components/dashboard/Settings";
import AddSubscriptionForm from "./components/dashboard/AddSubscriptionForm"; 
import Modal from "./components/ui/Modal"; 
import { cn } from "./utils/helpers";
import AuthPage from "./components/auth/AuthPage"; 
import { useUser } from "./context/UserContext"; 
import { Loader2 } from "lucide-react"; 
import { useNotificationService } from "./hooks/useNotificationService";

const SlowSuccessIcon = () => {
  return (
    <div className="relative flex items-center justify-center w-6 h-6">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="absolute inset-0 bg-cyan-100 rounded-full"
      />
      
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <motion.path
          d="M1 5L4.5 8.5L13 1"
          stroke="#0891b2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ 
            duration: 1.2,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
      </svg>
    </div>
  );
};

const modernToastOptions = {
  duration: 5000, 
  position: "top-center",
  style: {
    background: "rgba(255, 255, 255, 0.9)", 
    backdropFilter: "blur(12px)",
    color: "#18181b",
    fontSize: "14px",
    fontWeight: "600",
    padding: "12px 24px",
    borderRadius: "99px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 20px 40px -10px rgba(8, 145, 178, 0.15)",
  },
  success: {
    duration: 2000, 
    icon: <SlowSuccessIcon />, 
    style: { 
      border: "1px solid rgba(8, 145, 178, 0.3)",
      background: "rgba(236, 254, 255, 0.85)"
    }
  },
  error: {
    duration: 6000,
    iconTheme: { primary: "#ef4444", secondary: "white" },
    style: { 
        border: "1px solid rgba(239, 68, 68, 0.2)",
        background: "rgba(254, 242, 242, 0.85)"
    }
  },
};


const LiquidTransition = () => {
  return (
    <motion.div
      key="liquid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="watercolor" x="-50%" y="-50%" width="200%" height="200%">
       
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
       
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0   0 1 0 0 0   0 0 1 0 0   0 0 0 22 -7"
              result="sharp"
            />
            <feBlend in="SourceGraphic" in2="sharp" mode="normal" />
          </filter>
        </defs>
      </svg>

  
      <div
        style={{
          position: "relative",
          width: "220px",
          height: "220px",
          filter: "url(#watercolor)",
        }}
      >
       
        <motion.div
          animate={{
            x: [0, 22, -14, 8, 0],
            y: [0, -16, 20, -8, 0],
            scale: [1, 1.18, 0.88, 1.06, 1],
          }}
          transition={{
            duration: 3.0,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
          style={{
            position: "absolute",
            width: "130px",
            height: "130px",
            top: "30px",
            left: "20px",
            background: "radial-gradient(circle, rgba(8,145,178,1) 0%, rgba(6,182,212,0.9) 40%, rgba(34,211,238,0.5) 70%, transparent 100%)",
            borderRadius: "50%",
          }}
        />

      
        <motion.div
          animate={{
            x: [0, -25, 18, -10, 0],
            y: [0, 20, -14, 12, 0],
            scale: [1, 0.86, 1.22, 0.94, 1],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
            delay: 0.3,
          }}
          style={{
            position: "absolute",
            width: "110px",
            height: "110px",
            top: "50px",
            right: "18px",
            background: "radial-gradient(circle, rgba(34,211,238,1) 0%, rgba(103,232,249,0.85) 45%, rgba(186,230,253,0.4) 72%, transparent 100%)",
            borderRadius: "50%",
          }}
        />

   
        <motion.div
          animate={{
            x: [0, 18, -22, 6, 0],
            y: [0, -22, 12, -16, 0],
            scale: [0.95, 1.15, 0.9, 1.08, 0.95],
          }}
          transition={{
            duration: 4.0,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
            delay: 0.6,
          }}
          style={{
            position: "absolute",
            width: "100px",
            height: "100px",
            bottom: "22px",
            left: "55px",
            background: "radial-gradient(circle, rgba(14,116,144,0.95) 0%, rgba(8,145,178,0.7) 42%, rgba(6,182,212,0.3) 70%, transparent 100%)",
            borderRadius: "50%",
          }}
        />

      
        <motion.div
          animate={{
            x: [0, 28, -10, 20, 0],
            y: [0, 14, -20, 8, 0],
            scale: [1, 0.92, 1.14, 0.96, 1],
          }}
          transition={{
            duration: 3.3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
            delay: 0.9,
          }}
          style={{
            position: "absolute",
            width: "90px",
            height: "90px",
            top: "65px",
            left: "8px",
            background: "radial-gradient(circle, rgba(148,163,184,0.85) 0%, rgba(186,230,253,0.55) 50%, transparent 100%)",
            borderRadius: "50%",
          }}
        />

       
        <motion.div
          animate={{
            x: [0, -12, 16, -6, 0],
            y: [0, 18, -10, 14, 0],
            scale: [1, 1.2, 0.85, 1.1, 1],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
            delay: 0.15,
          }}
          style={{
            position: "absolute",
            width: "85px",
            height: "85px",
            top: "18px",
            left: "68px",
            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(224,242,254,0.8) 45%, transparent 100%)",
            borderRadius: "50%",
          }}
        />
      </div>
    </motion.div>
  );
};

function App() {
  const { user, loading, isTransitioning } = useUser(); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useNotificationService();

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
              >
                <Loader2 size={40} className="text-cyan-600 animate-spin" />
              </motion.div>
          </div>
      );
  }

  if (!user) {
      return (
        <>
         
          <AnimatePresence>
            {isTransitioning && <LiquidTransition />}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div 
              key="auth"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-full"
            >
                <Toaster toastOptions={modernToastOptions} />
                <AuthPage />
            </motion.div>
          </AnimatePresence>
        </>
      );
  }

  return (
    <>
    
      <AnimatePresence>
        {isTransitioning && <LiquidTransition />}
      </AnimatePresence>

      <div className="min-h-screen flex text-zinc-900 font-sans bg-background overflow-hidden relative">
        
        <Toaster toastOptions={modernToastOptions} />

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        <Sidebar 
          isCollapsed={isCollapsed} 
          toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
          isMobileMenuOpen={isMobileMenuOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />
       
        <main 
          className={cn(
            "flex-1 h-screen overflow-y-auto p-4 md:p-8 transition-all duration-500 cubic-bezier(0.25, 0.8, 0.25, 1) scroll-smooth",
            isCollapsed ? "ml-0 lg:ml-20" : "ml-0 lg:ml-72"
          )}
        >
          <Header 
              onOpenModal={() => setIsModalOpen(true)}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />

          <Routes>
              <Route path="/" element={<DashboardView />} />
              <Route path="/subscriptions" element={<SubscriptionList />} />
              <Route path="/wallet" element={<WalletView />} />
              <Route path="/reports" element={<SummaryChart />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Modal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              title="Yeni Abonelik Ekle"
          >
              <AddSubscriptionForm onSuccess={() => setIsModalOpen(false)} />
          </Modal>

        </main>
      </div>
    </>
  );
}

export default App;