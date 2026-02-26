import { LayoutGrid, CreditCard, BarChart2, Settings, MessageSquare, Bell, LogOut, ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { cn } from "../../utils/helpers";
import { NavLink } from "react-router-dom";
import { useUI } from "../../context/UIContext";
import { useUser } from "../../context/UserContext";

const Sidebar = ({ isCollapsed, toggleSidebar, isMobileMenuOpen, closeMobileMenu }) => {

    const { notifications } = useUI();
    const { logout } = useUser();

    const unreadCount = notifications.filter(n => !n.read).length;

    const menuItems = [
        { path: "/", icon: LayoutGrid, label: "Genel Bakış" },
        { path: "/subscriptions", icon: CreditCard, label: "Abonelikler", badge: 5 },
        { path: "/wallet", icon: Wallet, label: "Cüzdanım" },
        { path: "/reports", icon: BarChart2, label: "Raporlar" },
        { path: "/messages", icon: MessageSquare, label: "Mesajlar", badge: 3 },
        {
            path: "/notifications",
            icon: Bell,
            label: "Bildirimler",
            badge: unreadCount > 0 ? unreadCount : null
        },
        { path: "/settings", icon: Settings, label: "Ayarlar" },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                "h-full w-72 lg:h-[calc(100vh-32px)] lg:rounded-4xl",
                "lg:my-4 lg:ml-4",
                "bg-white/95 dark:bg-zinc-900/95 lg:bg-white/80 dark:lg:bg-zinc-900/80 backdrop-blur-xl supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-zinc-900/60",
                "flex flex-col shadow-2xl shadow-zinc-300/30 dark:shadow-black/40 ring-1 ring-cyan-100/50 dark:ring-cyan-900/30",


                isCollapsed ? "lg:w-20" : "lg:w-70",


                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
        >
            {/*  logo ve başlık */}
            <div className="h-20 lg:h-28 flex items-center justify-center relative border-b border-zinc-100/50 dark:border-zinc-800/50 mb-2 mt-4  lg:mt-0">
                <div className={cn(
                    "relative flex items-center gap-4 transition-all duration-500",

                    isCollapsed ? "lg:justify-center lg:pl-0 pl-4" : "justify-start pl-2"
                )}>
                    <div className="absolute inset-0 w-10 h-10 bg-cyan-400/20 blur-2xl rounded-full -z-10"></div>

                    {/* logo */}
                    <div className="relative z-10 flex items-center justify-center">
                        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500 drop-shadow-sm">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>

                    {/* logo text*/}
                    <h1 className={cn(
                        "text-3xl font-black tracking-tighter overflow-hidden transition-all duration-500 mr-3 whitespace-nowrap relative z-10",
                        "text-cyan-500",
                        isCollapsed ? "lg:w-0 lg:opacity-0 lg:hidden block w-auto opacity-100" : "w-auto opacity-100 block"
                    )}>
                        SubSage
                    </h1>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="hidden lg:flex absolute -right-3 top-1/1 -translate-y-1/2 w-7 h-7 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full items-center justify-center text-cyan-600 dark:text-cyan-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:scale-110 transition-all shadow-sm cursor-pointer z-50"
                >
                    {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                </button>
            </div>
             
                {/* menü öğeleri */}
            <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) => cn(
                            "w-full flex items-center transition-all duration-200 group relative font-medium outline-none",
                            "hover:scale-[1.04] active:scale-[0.98]",


                            isCollapsed ? "lg:justify-center lg:px-0 lg:py-4 lg:rounded-2xl px-4 py-3.5 rounded-2xl justify-start gap-3.5" : "justify-start gap-3.5 px-4 py-3.5 rounded-2xl",
                            isActive
                                ? "bg-cyan-800 text-white shadow-lg shadow-cyan-500/20"
                                : "text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-100 hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-black/20"
                        )}
                        title={isCollapsed ? item.label : ""}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className={cn(
                                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full",
                                        !isCollapsed ? "" : "hidden lg:block"
                                    )}></div>
                                )}
                                <item.icon
                                    size={22}
                                    strokeWidth={isActive ? 2.0 : 2}
                                    className={cn("transition-colors", isActive ? "text-cyan-100" : "group-hover:text-cyan-500")}
                                />


                                <span className={cn("tracking-tight", isCollapsed ? "lg:hidden" : "block")}>
                                    {item.label}
                                </span>
                                {item.badge && (
                                    <span className={cn(
                                        "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full",
                                        isCollapsed ? "lg:hidden" : "block",
                                        isActive ? "bg-cyan-500 text-white" : "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:shadow-sm"
                                    )}>
                                        {item.badge}
                                    </span>
                                )}
                                {item.badge && isCollapsed && (
                                    <span className={cn(
                                        "hidden lg:block absolute top-2 right-2 w-2.5 h-2.5 rounded-full shadow-sm animate-ping",
                                        item.path === "/notifications" ? "bg-red-500" : "bg-cyan-500"
                                    )}></span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

             {/* çıkış yap butonu */}
            <div className={cn("mt-auto pb-6 px-3 transition-all duration-300")}>
                <div className={cn("border-t border-zinc-100/50 dark:border-zinc-800/50 mb-4", isCollapsed ? "lg:w-8 lg:mx-auto w-full" : "w-full")}></div>
                <button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center transition-all cursor-pointer duration-300 group relative font-medium outline-none rounded-2xl overflow-hidden",
                        isCollapsed
                            ? "lg:justify-center lg:h-12 lg:w-12 lg:mx-auto lg:hover:bg-red-50 dark:lg:hover:bg-red-950/30 justify-start gap-3.5 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-500 dark:text-zinc-400 hover:text-red-600"
                            : "justify-start gap-3.5 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-500 dark:text-zinc-400 hover:text-red-600"
                    )}
                    title="Çıkış Yap"
                >
                    <LogOut
                        size={25}
                        strokeWidth={2}
                        className={cn("transition-all duration-300", "group-hover:text-red-600")}
                    />
                    <span className={cn(
                        "group-hover:translate-x-1 transition-transform",
                        isCollapsed ? "lg:hidden" : "block"
                    )}>
                        Çıkış Yap
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;