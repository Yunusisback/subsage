import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header"; 
import DashboardView from "./components/dashboard/DashboardView"; 
import SubscriptionList from "./components/dashboard/SubscriptionList"; 
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

  return (
    <div className="min-h-screen flex text-zinc-900 font-sans bg-background overflow-hidden">
      
      {/* sidebar  */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main 
        className={cn(
          "flex-1 h-screen overflow-y-auto p-8 transition-all duration-300 ease-in-out scroll-smooth",
          isCollapsed ? "ml-20" : "ml-72"
        )}
      >
        
        {/* header  */}
        <Header 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onOpenModal={() => setIsModalOpen(true)}
        />

        {/* dashboard  */}
        {activeTab === TABS.DASHBOARD && (
            <DashboardView setActiveTab={setActiveTab} />
        )}

        {/* abonelikler */}
        {activeTab === TABS.SUBSCRIPTIONS && <SubscriptionList />}
        
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