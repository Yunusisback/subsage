import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle, Info, Clock, XCircle, Menu, Sun, Moon } from "lucide-react";
import { useUI } from "../../context/UIContext";
import { useUser } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/helpers";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ onOpenMobileMenu }) => {

    const { notifications, darkMode, toggleDarkMode } = useUI();
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

    const getTypeStyles = (type) => {
        switch (type) {
            case "success": return { bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-100 dark:border-emerald-900/50", icon: "text-emerald-600", dot: "bg-emerald-500" };
            case "warning": return { bg: "bg-red-50 dark:bg-red-950/40", border: "border-red-100 dark:border-red-900/50", icon: "text-red-600", dot: "bg-red-500" };
            case "alert": return { bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-100 dark:border-amber-900/50", icon: "text-amber-600", dot: "bg-amber-500" };
            case "info": return { bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-100 dark:border-blue-900/50", icon: "text-blue-600", dot: "bg-blue-500" };
            default: return { bg: "bg-zinc-50 dark:bg-zinc-800", border: "border-zinc-100 dark:border-zinc-700", icon: "text-zinc-500 dark:text-zinc-400", dot: "bg-zinc-400 dark:bg-zinc-500" };
        }
    };

    return (
        <header className="relative z-30 mb-6 md:mb-8 flex justify-between items-center h-16 animate-in fade-in slide-in-from-top-4 duration-500">

            {/* Başlık ve Mobil Menü */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenMobileMenu}
                    className="p-2 -ml-2 rounded-xl text-cyan-800 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-zinc-800 hover:text-cyan-600 dark:hover:text-cyan-300 lg:hidden transition-colors cursor-pointer"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-2xl md:text-3xl pl-1 md:pl-3 font-bold tracking-[0.055em]! text-cyan-800 dark:text-cyan-400 truncate">
                    {currentTitle}
                </h1>
            </div>

            {/* Bildirim ve Profil */}
            <div className="flex items-center gap-3 md:gap-4 pr-0 md:pr-2">

                {/* dark mode toggle butonu */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2.5 md:p-3.5 rounded-full bg-white dark:bg-zinc-800 border-3 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all cursor-pointer shadow-sm active:scale-95"
                    title={darkMode ? "Açık Moda Geç" : "Koyu Moda Geç"}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={darkMode ? "sun" : "moon"}
                            initial={{ rotate: -30, scale: 0.7, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            exit={{ rotate: 30, scale: 0.7, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                            {darkMode
                                ? <Sun size={22} className="md:w-6 md:h-6" />
                                : <Moon size={22} className="md:w-6 md:h-6" />
                            }
                        </motion.div>
                    </AnimatePresence>
                </button>

                {/* Bildirim */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2.5 md:p-3.5 rounded-full bg-white dark:bg-zinc-800 border-3 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                        <Bell size={22} className="md:w-6 md:h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white dark:border-zinc-800 animate-ping"></span>
                        )}
                        {unreadCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white dark:border-zinc-800"></span>
                        )}
                    </button>
                    
                      {/* bildirim paneli */}
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute -right-16 md:right-0 top-full mt-3 w-80 md:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl dark:shadow-black/40 z-50 overflow-hidden origin-top-right"
                            >
                                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-zinc-800/50 backdrop-blur-md">
                                    <span className="text-sm font-bold text-cyan-900 dark:text-cyan-300">Bildirimler</span>
                                    {unreadCount > 0 ? (
                                        <span className="text-[10px] bg-cyan-600 dark:bg-cyan-700 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">{unreadCount} Yeni</span>
                                    ) : (
                                        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-bold border border-zinc-200 dark:border-zinc-700">Hepsi Okundu</span>
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
                                                    "w-full text-left px-4 py-3 transition-all flex gap-3 group border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 relative overflow-hidden cursor-pointer",
                                                    isUnread
                                                        ? cn(styles.bg, "dark:hover:brightness-110")
                                                        : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                )}
                                            >
                                                {isUnread && (
                                                    <div className={cn("absolute left-0 top-0 bottom-0 w-1", styles.dot)} />
                                                )}
                                                <div className={cn(
                                                    "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                                    isUnread ? cn("bg-white dark:bg-zinc-800 border-white/50 dark:border-zinc-700 shadow-sm", styles.icon) : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500"
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
                                                            isUnread ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
                                                        )}>
                                                            {note.title}
                                                        </p>
                                                        <span className="text-[9px] text-zinc-500 dark:text-zinc-500 whitespace-nowrap">{note.time}</span>
                                                    </div>
                                                    <p className={cn(
                                                        "text-[10px] line-clamp-2 leading-relaxed",
                                                        isUnread ? "text-zinc-700 dark:text-zinc-300 font-medium" : "text-zinc-400 dark:text-zinc-500"
                                                    )}>
                                                        {note.message}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                    {notifications.length === 0 && (
                                        <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                                            Bildiriminiz bulunmuyor.
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                                    <button
                                        onClick={() => {
                                            navigate("/notifications");
                                            setShowNotifications(false);
                                        }}
                                        className="w-full py-2 text-xs text-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 rounded-lg hover:bg-cyan-50 dark:hover:bg-zinc-800"
                                    >
                                        Tümünü Gör
                                        <span className="text-[10px] opacity-70">→</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profil Bölümü */}
                <button
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2 pl-1.5 md:pl-2.5 pr-1.5 md:pr-4 py-1.5 md:py-2 rounded-full bg-white dark:bg-zinc-800 border-3 border-zinc-200 dark:border-zinc-700 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all group cursor-pointer shadow-sm active:scale-95"
                >
                    <div className="w-8 h-8 md:w-10 md:h-10 min-w-8 md:min-w-9 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-600 group-hover:border-cyan-300 dark:group-hover:border-cyan-600 transition-colors">
                        {hasAvatar ? (
                            <img
                                src={userSettings.avatar}
                                alt="User"
                                className="w-full h-full object-cover opacity-100 transition-opacity"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                }}
                            />
                        ) : null}

                        <span
                            className="w-full h-full flex items-center justify-center text-sm font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/50 group-hover:bg-cyan-600 group-hover:text-white transition-colors"
                            style={{ display: hasAvatar ? "none" : "flex" }}
                        >
                            {avatarInitial}
                        </span>
                    </div>
                    <div className="text-left hidden md:block">
                        <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                            {userSettings.name}
                        </h4>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Header;