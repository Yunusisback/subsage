import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle, Info, Clock, XCircle, Menu } from "lucide-react";
import { useUI } from "../../context/UIContext";
import { useUser } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/helpers";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ onOpenMobileMenu }) => {

    const { notifications } = useUI();
    const { userSettings } = useUser();

    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Okunmamış bildirim sayısı
    const unreadCount = notifications.filter(n => !n.read).length;


    const avatarInitial = userSettings.name?.charAt(0)?.toUpperCase() || "?";
    const hasAvatar = !!userSettings.avatar;

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const getPageTitle = (path) => {
        switch (path) {
            case "/": return "Yönetim Paneli";
            case "/subscriptions": return "Abonelikler";
            case "/wallet": return "Cüzdanım";
            case "/reports": return "Raporlar";
            case "/messages": return "Mesajlar";
            case "/notifications": return "Bildirimler";
            case "/settings": return "Ayarlar";
            default: return "Yönetim Paneli";
        }
    };


    const currentTitle = getPageTitle(location.pathname);

    // Bildirim tipi stilleri
    const getTypeStyles = (type) => {
        switch (type) {
            case "success": return { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-600", dot: "bg-emerald-500" };
            case "warning": return { bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-600", dot: "bg-amber-500" };
            case "alert": return { bg: "bg-red-50", border: "border-red-100", icon: "text-red-600", dot: "bg-red-500" };
            case "info": return { bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-600", dot: "bg-blue-500" };
            default: return { bg: "bg-zinc-50", border: "border-zinc-100", icon: "text-zinc-500", dot: "bg-zinc-400" };
        }
    };

    return (
        <header className="relative z-30 mb-6 md:mb-8 flex justify-between items-center h-16 animate-in fade-in slide-in-from-top-4 duration-500">

            {/* Başlık ve Mobil Menü */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenMobileMenu}
                    className="p-2 -ml-2 rounded-xl text-cyan-800 hover:bg-cyan-700 hover:text-cyan-50 lg:hidden transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-2xl md:text-3xl pl-1 md:pl-3 font-bold tracking-[0.055em]! text-cyan-800 truncate">
                    {currentTitle}
                </h1>
            </div>

            {/* Bildirim ve Profil */}
            <div className="flex items-center  gap-3 md:gap-4 pr-0 md:pr-2 ">

                {/* Bildirim */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2.5 ring-2 ring-cyan-600 md:p-3.5 rounded-3xl bg-cyan-700 hover:bg-cyan-600 text-cyan-50 transition-colors relative cursor-pointer shadow-sm "
                    >
                        <Bell size={22} className="md:w-6 md:h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 right-1.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-ping"></span>
                        )}
                    </button>
                    
                    {/* Menü */}
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute -right-6 md:right-0 top-full mt-3 w-80 md:w-96 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden origin-top-right"
                            >
                                <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30 backdrop-blur-md">
                                    <span className="text-sm font-bold text-zinc-900">Bildirimler</span>
                                    {unreadCount > 0 ? (
                                        <span className="text-[10px] bg-cyan-700 text-cyan-50 px-2 py-0.5 rounded-full font-bold border border-cyan-800 shadow-sm">{unreadCount} Yeni</span>
                                    ) : (
                                        <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-bold">Hepsi Okundu</span>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                    {notifications.slice(0, 5).map((note) => {
                                        const styles = getTypeStyles(note.type);
                                        const isUnread = !note.read;
                                        return (
                                            <button
                                                key={note.id}
                                                onClick={() => {
                                                    navigate("/notifications");
                                                    setShowNotifications(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-3 transition-all flex gap-3 group border-b border-zinc-50 last:border-0 relative overflow-hidden",
                                                    isUnread
                                                        ? cn(styles.bg, "hover:brightness-95")
                                                        : "bg-white hover:bg-zinc-50"
                                                )}
                                            >
                                                {isUnread && (
                                                    <div className={cn("absolute left-0 top-0 bottom-0 w-1", styles.dot)} />
                                                )}
                                                <div className={cn(
                                                    "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                                    isUnread ? cn("bg-white border-white/50 shadow-sm", styles.icon) : "bg-zinc-100 border-zinc-200 text-zinc-400"
                                                )}>
                                                    {note.type === "success" && <CheckCircle size={14} strokeWidth={2.5} />}
                                                    {note.type === "warning" && <Clock size={14} strokeWidth={2.5} />}
                                                    {note.type === "alert" && <XCircle size={14} strokeWidth={2.5} />}
                                                    {note.type === "info" && <Info size={14} strokeWidth={2.5} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <p className={cn(
                                                            "text-xs font-bold truncate pr-2",
                                                            isUnread ? "text-zinc-900" : "text-zinc-500"
                                                        )}>
                                                            {note.title}
                                                        </p>
                                                        <span className="text-[9px] text-zinc-400 whitespace-nowrap">{note.time}</span>
                                                    </div>
                                                    <p className={cn(
                                                        "text-[10px] line-clamp-2 leading-relaxed",
                                                        isUnread ? "text-zinc-600 font-medium" : "text-zinc-400"
                                                    )}>
                                                        {note.message}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                    {notifications.length === 0 && (
                                        <div className="p-8 text-center text-zinc-400 text-xs">
                                            Bildiriminiz bulunmuyor.
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-zinc-100 bg-zinc-50/50">
                                    <button
                                        onClick={() => {
                                            navigate("/notifications");
                                            setShowNotifications(false);
                                        }}
                                        className="w-full py-2 text-xs text-center text-zinc-500 hover:text-zinc-900 font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                                    >
                                        Tümünü Gör
                                        <span className="text-[10px] opacity-50">→</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profil Bölümü */}
                <button
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2 pl-1.5 md:pl-2.5 pr-1.5 md:pr-4 py-1.5 md:py-2 rounded-full ring-1 ring-cyan-600 bg-cyan-700 hover:bg-cyan-600 transition-all group cursor-pointer shadow-sm"
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 min-w-8 md:min-w-9 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-cyan-600 cyan-300 ring ring-cyan-600">
                        {hasAvatar ? (
                            <img
                                src={userSettings.avatar}
                                alt="User"
                                className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity"
                                onError={(e) => {

                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                }}
                            />
                        ) : null}

                        <span
                            className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-cyan-600"
                            style={{ display: hasAvatar ? "none" : "flex" }}
                        >
                            {avatarInitial}
                        </span>
                    </div>
                    <div className="text-left hidden md:block">
                        <h4 className="text-m font-bold text-cyan-50 group-hover:text-white transition-colors">
                            {userSettings.name}
                        </h4>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Header;