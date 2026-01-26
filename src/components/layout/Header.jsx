import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react"; 
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
        <h1 className="text-3xl pl-3 font-bold tracking-tight text-yellow-800">
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
                className="p-3 rounded-3xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-colors relative cursor-pointer shadow-sm"
            >
                <Bell size={25} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-ping"></span>
                )}
            </button>

            {/* Menü */}
            {showNotifications && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                        <span className="text-sm font-bold text-zinc-900">Bildirimler</span>
                        {unreadCount > 0 ? (
                           <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold border border-yellow-200">{unreadCount} Yeni</span>
                        ) : (
                           <span className="text-[10px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-bold">Hepsi Okundu</span>
                        )}
                    </div>
                    
                    <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">

                        {/* Dinamik Bildirimler */}
                        {notifications.slice(0, 3).map((note) => (
                           <button 
                              key={note.id}
                              onClick={() => { setActiveTab(TABS.NOTIFICATIONS); setShowNotifications(false); }} 
                              className="w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors flex gap-3 group cursor-pointer border-b border-zinc-50 last:border-0"
                           >
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!note.read ? 'bg-green-50' : 'bg-zinc-300'}`}></div>
                              <div>
                                  <p className={`text-xs font-bold group-hover:text-black ${!note.read ? 'text-zinc-900' : 'text-zinc-500'}`}>{note.title}</p>
                                  <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{note.message}</p>
                              </div>
                          </button>
                        ))}
                        
                    </div>

                    <div className="p-2 border-t border-zinc-100 bg-zinc-50/50">
                        <button 
                            onClick={() => { setActiveTab(TABS.NOTIFICATIONS); setShowNotifications(false); }}
                            className="w-full py-2 text-xs text-center text-zinc-500 hover:text-zinc-900 font-medium transition-colors cursor-pointer"
                        >
                            Tümünü Gör
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Profil Bölümü */}
        <button className="flex items-center gap-2 pl-2.5 pr-4 py-2 rounded-full bg-white border border-yellow-500 hover:bg-zinc-50 hover:border-zinc-300 transition-all group cursor-pointer shadow-sm">
            <div className="w-10 h-10 min-w-9 rounded-full bg-zinc-100 ring-2 ring-white flex items-center justify-center overflow-hidden">
                <img 
                    src="https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkNTM1NTYuanBlZw==" 
                    alt="User" 
                    className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity" 
                />
            </div>
            <div className="text-left">
                <h4 className="text-m font-bold text-zinc-900 group-hover:text-black transition-colors">Burak</h4>
    
            </div>
        </button>

      </div>
    </header>
  );
};

export default Header;