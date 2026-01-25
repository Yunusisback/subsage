import { useState, useEffect, useRef } from "react";
import { Bell, Plus } from "lucide-react";
import Button from "../ui/Button";
import { TABS } from "../../utils/constants";
import { useGlobal } from "../../context/GlobalContext";

const Header = ({ activeTab, setActiveTab, onOpenModal }) => {
  const { notifications } = useGlobal(); 
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Okunmamış bildirim sayısı
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    
    <header className="relative z-50 mb-8 flex justify-between items-center h-16 animate-in fade-in slide-in-from-top-4 duration-500">

      {/* Başlık */}
      <div>
        <h1 className="text-3xl pl-3 font-bold tracking-tight text-yellow-500">
          {activeTab === TABS.DASHBOARD && "Yönetim Paneli"}
          {activeTab === TABS.SUBSCRIPTIONS && "Abonelikler"}
          {activeTab === TABS.REPORTS && "Raporlar"}
          {activeTab === TABS.MESSAGES && "Mesajlar"}
          {activeTab === TABS.NOTIFICATIONS && "Bildirimler"}
          {activeTab === TABS.SETTINGS && "Ayarlar"}
        </h1>
      </div>

      {/* Bildirim ve Profil */}
      <div className="flex items-center gap-4 pr-2">
        
        {/* Bildirim */}
        <div className="relative" ref={notificationRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors relative border border-white/5 cursor-pointer"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-dark-bg"></span>
                )}
            </button>

            {/* Menü */}
            {showNotifications && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-[#121214] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <span className="text-sm font-bold text-white">Bildirimler</span>
                        {unreadCount > 0 ? (
                           <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">{unreadCount} Yeni</span>
                        ) : (
                           <span className="text-[10px] bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded font-bold">Hepsi Okundu</span>
                        )}
                    </div>
                    
                    <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">

                        {/* Dinamik Bildirimler */}
                        {notifications.slice(0, 3).map((note) => (
                           <button 
                              key={note.id}
                              onClick={() => { setActiveTab(TABS.NOTIFICATIONS); setShowNotifications(false); }} 
                              className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex gap-3 group cursor-pointer"
                           >
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!note.read ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
                              <div>
                                  <p className={`text-xs font-bold group-hover:text-white ${!note.read ? 'text-zinc-200' : 'text-zinc-500'}`}>{note.title}</p>
                                  <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{note.message}</p>
                              </div>
                          </button>
                        ))}
                        
                    </div>

                    <div className="p-2 border-t border-white/5 bg-black/20">
                        <button 
                            onClick={() => { setActiveTab(TABS.NOTIFICATIONS); setShowNotifications(false); }}
                            className="w-full py-2 text-xs text-center text-zinc-400 hover:text-white font-medium transition-colors cursor-pointer"
                        >
                            Tümünü Gör
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Profil Bölümü */}
        <button className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-all group cursor-pointer">
            <div className="w-9 h-9 min-w-9 rounded-full bg-zinc-900 ring-2 ring-white/10 flex items-center justify-center overflow-hidden">
                <img 
                    src="https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkNTM1NTYuanBlZw==" 
                    alt="User" 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                />
            </div>
            <div className="text-left">
                <h4 className="text-sm font-bold text-gray-200 group-hover:text-yellow-400 transition-colors">Burak Y.</h4>
                <span className="text-[10px] text-zinc-500 font-bold block -mt-0.5">Pro Üye</span>
            </div>
        </button>

         {/* Yeni Ekle Butonu */}
         {activeTab === TABS.SUBSCRIPTIONS && (
             <Button 
                variant="primary" 
                size="sm"
                className="ml-2"
                onClick={onOpenModal} 
             >
                <Plus size={16} className="mr-1.5" />
                Yeni
             </Button>
         )}

      </div>
    </header>
  );
};

export default Header;