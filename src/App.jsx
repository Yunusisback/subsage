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
import { TABS } from "./utils/constants";
function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex text-zinc-900 font-sans bg-background overflow-hidden relative">
      
      {/* Toast Bildirim Alanı*/}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#ecfccb', 
              color: '#166534', 
              border: '1px solid #bef264', 
              fontWeight: 'bold',
            },
            iconTheme: {
              primary: '#166534',
              secondary: '#ecfccb',
            },
          },
        }}
      />

      {/* mobil overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* sidebar  */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false); 
        }}
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />
      
      <main 
        className={cn(
          "flex-1 h-screen overflow-y-auto p-4 md:p-8 transition-all duration-300 ease-in-out scroll-smooth",
    
          isCollapsed ? "ml-0 lg:ml-20" : "ml-0 lg:ml-72"
        )}
      >
        
        {/* header  */}
        <Header 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onOpenModal={() => setIsModalOpen(true)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* dashboard  */}
        {activeTab === TABS.DASHBOARD && (
            <DashboardView setActiveTab={setActiveTab} />
        )}

        {/* abonelikler */}
        {activeTab === TABS.SUBSCRIPTIONS && <SubscriptionList />}

        {/* cüzdan (Yeni) */}
        {activeTab === TABS.WALLET && <WalletView />}
        
        {/* raporlar */}
        {activeTab === TABS.REPORTS && <SummaryChart />}
        
        {/* mesajlar */}
        {activeTab === TABS.MESSAGES && <Messages />}
        
        {/* bildirimler */}
        {activeTab === TABS.NOTIFICATIONS && <Notifications />} 

        {/* ayarlar */}
        {activeTab === TABS.SETTINGS && <Settings />}

        {/* global modal */}
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