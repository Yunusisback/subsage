import { LayoutGrid, CreditCard, BarChart2, Settings, MessageSquare, Bell, LogOut, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "../../utils/helpers";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  
  const menuItems = [
    { icon: LayoutGrid, label: "Genel Bakış", active: true },
    { icon: CreditCard, label: "Abonelikler", active: false, badge: 5 },
    { icon: BarChart2, label: "Raporlar", active: false },
    { icon: MessageSquare, label: "Mesajlar", active: false, badge: 3 },
    { icon: Bell, label: "Bildirimler", active: false },
    { icon: Settings, label: "Ayarlar", active: false },
  ];

  return (
    <aside 
      className={cn(
        "h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-300 ease-in-out border-r border-white/10",
        "bg-[#160f0f96]",
        isCollapsed ? "w-24 py-9 items-center gap-4" : "w-72 p-6" 
      )}
    >
      
      {/* Logo alanı */}
      <div className={cn(
          "relative flex items-center gap-5 ml-2 transition-all duration-300", 
          isCollapsed ? "mb-10 justify-center" : "mb-18 px-2 w-full" 
        )}>
        
        {/* Logo */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 blur-xl rounded-full pointer-events-none"></div>

        {/* Logo İkonu */}
        <div className="relative z-10 w-10 h-10 min-w-10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300 ">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
        </div>
        
        {/* Yazı */}
       <h1 className={cn(
    "text-2xl font-black tracking-tighter overflow-hidden transition-all duration-300 whitespace-nowrap relative z-10",

    "bg-linear-to-br from-yellow-100 via-yellow-300 to-yellow-600 bg-clip-text text-transparent",
    isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"
)}>
    SubSage
</h1>
      </div>

      {/* açma kapama butonu */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-background border border-white/10 rounded-full flex items-center justify-center text-zinc-200 hover:text-red-800 hover:bg-yellow-400 hover:border-yellow-800 transition-all z-50 shadow-xl cursor-pointer"
      >
        {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      {/* Arama çubuğu */}
      <div className={cn("mb-10 transition-all w-full", isCollapsed ? "flex justify-center" : "px-2")}>
        {isCollapsed ? (
             <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Search size={20} />
             </button>
        ) : (
            <div className="relative group w-full">
                <input 
                  type="text" 
                  placeholder="..." 
                  className="w-full bg-white/10 text-sm text-zinc-300 rounded-xl px-4 py-3 pl-10 border border-white/15 focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-zinc-300 focus:shadow-[0_0_15px_rgba(141, 127, 12, 1)]"
                />
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-yellow-500 group-focus-within:text-yellow-500 transition-colors" />
            </div>
        )}
      </div>

      {/* menü linkleri */}
      <nav className="flex-1 space-y-3 w-full">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center transition-all cursor-pointer duration-300 group relative font-medium outline-none overflow-hidden",
              isCollapsed ? "justify-center h-11 px-0 w-11 mx-auto rounded-xl" : "justify-between px-4 py-3.5  rounded-xl",
              
          
              item.active 
                ? "bg-blue-600/10 border border-gray-500/10 text-white" 
                : "text-zinc-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
            )}
            title={isCollapsed ? item.label : ""}
          >
            {/* Aktif Buton Arkasındaki Işık  */}
            {item.active && (
                 <div className="absolute inset-0 bg-gray-500/10 blur-lg rounded-xl"></div>
            )}

            <div className={cn("relative z-10 flex items-center gap-3", isCollapsed && "justify-center")}>
              <item.icon 
                size={20} 
                className={cn(
                  "transition-colors duration-300",
                  item.active ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(172, 158, 42, 0.8)]" : "text-zinc-500 group-hover:text-zinc-200"
                )} 
              />
              
              {!isCollapsed && (
                  <span className="text-sm tracking-wide">{item.label}</span>
              )}
            </div>

            {/* badge */}
            {item.badge && (
              isCollapsed ? (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              ) : (
                <span className={cn(
                    "relative z-10 min-w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold px-1.5",
                    item.active ? "bg-blue-500 text-white shadow-lg" : "bg-white/5 text-zinc-400 border border-white/5"
                )}>
                    {item.badge}
                </span>
              )
            )}
          </button>
        ))}
      </nav>

      {/*  profil kartı */}
      <div className={cn("mt-auto pt-6 border-t border-white/5 w-full transition-all", isCollapsed ? "flex justify-center border-none" : "")}>
        <div className={cn(
            "flex items-center gap-3 rounded-2xl cursor-pointer transition-all group border border-transparent",
            isCollapsed ? "p-0 justify-center w-10 h-10 hover:scale-105" : "p-3 w-full hover:bg-white/5 hover:border-white/5"
        )}>
          
          {/* Avatar  */}
  <div className="w-10 h-10 min-w-10 rounded-full bg-[#050505] flex items-center justify-center overflow-hidden">
  <img src="https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkNTM1NTYuanBlZw==" alt="User" className="w-full h-full object-cover" />
</div>
          {!isCollapsed && (
            <>
                <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-m font-bold text-gray-100 truncate group-hover:text-red-400 transition-colors">Burak Y.</h4>
                </div>
                <LogOut size={18} className="text-red-500 hover:text-red-600 transition-colors" />
            </>
          )}
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;