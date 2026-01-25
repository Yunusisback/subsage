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
        "h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-500 ease-out border-r border-zinc-200",
        "bg-sidebar backdrop-blur-xl", 
        isCollapsed ? "w-22 py-8 items-center " : "w-72 p-6" 
      )}
    >
      
      {/* logo alanı */}
      <div className={cn(
          "relative flex items-center gap-4 transition-all duration-500 mt-3", 
          isCollapsed ? "justify-center w-10 mb-8 pr-3" : "justify-start w-full py-3 mb-6 " 
        )}>
        
        {/* Glow Efekti */}
        <div className="absolute inset-0 w-10 h-10 bg-yellow-400/20 blur-2xl rounded-full -z-10"></div>

        {/* Logo İkonu */}
        <div className="relative z-10 flex items-center justify-center pl-4">
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 drop-shadow-sm">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
        </div>
        
        {/* Yazı */}
       <h1 className={cn(
            "text-3xl font-black tracking-tighter overflow-hidden transition-all duration-500 whitespace-nowrap relative z-10",
            "text-yellow-900", 
            isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"
        )}>
            SubSage
        </h1>
      </div>

      {/* Açma Kapama Butonu */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-28 w-6 h-6 bg-yellow-500 border border-zinc-200 rounded-full flex items-center justify-center text-zinc-600 hover:text-yellow-900 hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-300 z-50 shadow-sm cursor-pointer group"
      >
        {isCollapsed ? <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />}
      </button>

        {/* menü linkleri */}
      <nav className="flex-1 space-y-2 w-full mt-10">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                "w-full flex items-center transition-all duration-300 group relative font-medium outline-none rounded-xl overflow-hidden cursor-pointer",
             
                isCollapsed ? "justify-center h-11 w-11 mx-auto" : "justify-between px-4 py-3", 
                isActive
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/50" 
                    : "text-zinc-500 hover:text-yellow-800 hover:bg-white border border-transparent" 
                )}
                title={isCollapsed ? item.label : ""}
            >
                {/* aktif Sol kenar çizgisi  */}
                {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-500 rounded-r-full"></div>
                )}

                <div className={cn("relative z-10 flex items-center gap-3.5", isCollapsed && "gap-0")}>
                <item.icon 
                    size={20} 
                    strokeWidth={2}
                    className={cn(
                    "transition-all duration-300",
                    isActive 
                      ? "text-yellow-500" 
                      : "text-zinc-400 group-hover:text-yellow-500"
                    )} 
                />
                
                {!isCollapsed && (
                    <span className={cn(
                      "text-sm font-semibold tracking-wide transition-all",
                      isActive ? "text-zinc-900" : "group-hover:text-yellow-900"
                    )}>
                      {item.label}
                    </span>
                )}
                </div>

                {/* Badge */}
                {item.badge && !isCollapsed && (
                    <span className={cn(
                        "relative z-10 min-w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 transition-all border",
                        isActive 
                          ? "bg-yellow-200 text-yellow-900 border-transparent"
                          : "bg-yellow-800 text-white border-yellow-800 group-hover:bg-yellow-700 group-hover:border-yellow-700" 
                    )}>
                        {item.badge}
                    </span>
                )}

                {/* nokta */}
                {item.badge && isCollapsed && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-200 shadow-sm animate-ping"></span>
                )}
            </button>
          )
        })}
      </nav>

      {/* çıkış yap butonu*/}
      <div className={cn("mt-auto pt-6 border-t border-zinc-200 w-full transition-all duration-300", isCollapsed && "pt-4 border-none")}>
        <button 
            className={cn(
                "w-full flex items-center transition-all cursor-pointer duration-300 group relative font-medium outline-none rounded-xl overflow-hidden",
                isCollapsed ? "justify-center h-11 w-11 mx-auto" : "justify-start gap-3.5 px-4 py-3 hover:bg-red-50 text-zinc-500 hover:text-red-600 border border-transparent"
            )}
            title="Çıkış Yap"
        >
            <LogOut 
                size={22} 
                strokeWidth={2}
                className={cn(
                    "transition-all duration-300",
                    "group-hover:text-red-600"
                )} 
            />
            
            {!isCollapsed && (
                <span className="text-sm font-medium transition-colors">
                  Çıkış Yap
                </span>
            )}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;