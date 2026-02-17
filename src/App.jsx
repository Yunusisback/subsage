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

function App() {
  const { user, loading } = useUser(); 
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
      );
  }

  return (
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
  );
}

export default App;