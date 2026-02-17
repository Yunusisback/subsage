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

function App() {
  const { user, loading } = useUser(); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 
  useNotificationService();

 
  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <Loader2 size={40} className="text-cyan-600 animate-spin" />
          </div>
      );
  }


  if (!user) {
      return (
        <>
            <Toaster position="top-right" />
            <AuthPage />
        </>
      );
  }

  return (
    <div className="min-h-screen flex text-zinc-900 font-sans bg-background overflow-hidden relative">
      
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

    
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

     
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />
     
     
      <main 
        className={cn(
          "flex-1 h-screen overflow-y-auto p-4 md:p-8 transition-all duration-300 ease-in-out scroll-smooth",
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