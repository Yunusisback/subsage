import { LayoutGrid, CreditCard, BarChart2, Settings, MessageSquare, Bell, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/helpers";
import { TABS } from "../../utils/constants";

const Sidebar = ({ isCollapsed, toggleSidebar, activeTab, setActiveTab }) => {
  
  const menuItems = [
    { id: TABS.DASHBOARD, icon: LayoutGrid, label: "Genel Bakış" },
    { id: TABS.SUBSCRIPTIONS, icon: CreditCard, label: "Abonelikler", badge: 5 },
    { id: TABS.REPORTS, icon: BarChart2, label: "Raporlar" },
    { id: TABS.MESSAGES, icon: MessageSquare, label: "Mesajlar", badge: 3 },
    { id: TABS.NOTIFICATIONS, icon: Bell, label: "Bildirimler" },
    { id: TABS.SETTINGS, icon: Settings, label: "Ayarlar" },
  ];

  return (
    <aside 
      className={cn(
        "h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-500 ease-out border-r border-white/5",
        "bg-zinc-950/90 backdrop-blur-2xl", 
        isCollapsed ? "w-20 py-8 items-center" : "w-72 p-6" 
      )}
    >
      
      {/* logo alanı */}
      <div className={cn(
          "relative flex items-center gap-4 transition-all duration-500 mt-3", 
          isCollapsed ? "justify-center w-10 mb-8" : "justify-start w-full px-2 mb-6" 
        )}>
        
        {/* Glow Efekti */}
        <div className="absolute inset-0 w-10 h-10 bg-yellow-400/20 blur-2xl rounded-full -z-10 animate-pulse"></div>

        {/* Logo İkonu */}
        <div className="relative z-10 flex items-center justify-center pl-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
        </div>
        
        {/* Yazı */}
       <h1 className={cn(
            "text-2xl font-black tracking-tighter overflow-hidden transition-all duration-500 whitespace-nowrap relative z-10",
            "bg-linear-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-md",
            isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"
        )}>
            SubSage
        </h1>
      </div>

      {/* Açma Kapama Butonu */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300 z-50 shadow-xl cursor-pointer group"
      >
        {isCollapsed ? <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />}
      </button>

        {/* menü linkleri */}
      <nav className="flex-1 space-y-3 w-full mt-14">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                "w-full flex items-center transition-all duration-300 group relative font-medium outline-none rounded-xl overflow-hidden",
             
                isCollapsed ? "justify-center h-11 w-11 mx-auto" : "justify-between px-4 py-3", 
                isActive
                    ? "bg-linear-to-r from-yellow-500/10 to-transparent text-white shadow-lg border border-yellow-500/10" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/5 border border-transparent"
                )}
                title={isCollapsed ? item.label : ""}
            >
                {/* Aktif Glow */}
                {isActive && (
                    <div className="absolute inset-0 bg-linear-to-r from-yellow-500/20 via-yellow-500/5 to-transparent blur-lg opacity-50"></div>
                )}
                
                {/* Sol Kenar Çizgisi */}
                {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-r-full shadow-[0_0_10px_rgba(250,204,21,0.6)]"></div>
                )}

                <div className={cn("relative z-10 flex items-center gap-3.5", isCollapsed && "gap-0")}>
                <item.icon 
                    size={20} 
                    strokeWidth={2}
                    className={cn(
                    "transition-all duration-300",
                    isActive 
                      ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
                      : "text-zinc-500 group-hover:text-zinc-200"
                    )} 
                />
                
                {!isCollapsed && (
                    <span className={cn(
                      "text-sm font-medium tracking-wide transition-all",
                      isActive ? "text-white" : "group-hover:text-white"
                    )}>
                      {item.label}
                    </span>
                )}
                </div>

                {/* Badge */}
                {item.badge && !isCollapsed && (
                    <span className={cn(
                        "relative z-10 min-w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 transition-all shadow-md",
                        isActive 
                          ? "bg-yellow-400 text-black shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                          : "bg-white/10 text-zinc-400 border border-white/10 group-hover:bg-white/20"
                    )}>
                        {item.badge}
                    </span>
                )}

                {/* nokta */}
                {item.badge && isCollapsed && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.9)] animate-ping"></span>
                )}
            </button>
          )
        })}
      </nav>

      {/* çıkış yap butonu*/}
      <div className={cn("mt-auto pt-6 border-t border-white/5 w-full transition-all duration-300", isCollapsed && "pt-4 border-none")}>
        <button 
            className={cn(
                "w-full flex items-center transition-all duration-300 group relative font-medium outline-none rounded-xl overflow-hidden",
                isCollapsed ? "justify-center h-11 w-11 mx-auto" : "justify-start gap-3.5 px-4 py-3 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent"
            )}
            title="Çıkış Yap"
        >
            <LogOut 
                size={20} 
                strokeWidth={2}
                className={cn(
                    "transition-all duration-300",
                    "text-zinc-500 group-hover:text-red-400"
                )} 
            />
            
            {!isCollapsed && (
                <span className="text-sm font-medium text-zinc-400 group-hover:text-red-400 transition-colors">
                  Çıkış Yap
                </span>
            )}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;