import { Bell, CheckCircle, AlertTriangle, Info, Clock, Check } from "lucide-react";
import BentoCard from "../ui/BentoCard";
import { cn } from "../../utils/helpers";
import { useGlobal } from "../../context/GlobalContext";

const Notifications = () => {
  const { notifications, markAllNotificationsAsRead } = useGlobal();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto pb-15">
      
      <BentoCard glowColor="yellow" className="p-0 flex flex-col min-h-137.5">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/2">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                        <Bell className="text-yellow-500" size={24} />
                    </div>
                    Bildirim Merkezi
                </h2>
    
            </div>
            <button 
                onClick={markAllNotificationsAsRead}
                className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
            >
                <Check size={16} className="group-hover:text-yellow-500 transition-colors" />
                Tümünü okundu işaretle
            </button>
        </div>

        {/* Liste */}
        <div className="p-8 space-y-4 bg-black/20 flex-1">
            {notifications.length === 0 ? (
                 <div className="text-center text-zinc-500 py-10">Hiç bildiriminiz yok.</div>
            ) : (
                notifications.map((item) => {
                    const isUnread = !item.read;
                    return (
                    <div 
                        key={item.id} 
                        className={cn(
                            "group relative flex items-start gap-5 p-5 rounded-2xl transition-all duration-300 border",
                            isUnread 
                                ? "bg-[#121214] border-l-4 border-l-yellow-500 border-y-white/5 border-r-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_25px_rgba(234,179,8,0.1)] hover:border-y-yellow-500/10 hover:bg-[#161618]" 
                                : "bg-transparent border-transparent hover:bg-white/3 hover:border-white/5 opacity-75 hover:opacity-100"
                        )}
                    >
                        {/* İkon */}
                        <div className={cn(
                            "p-3.5 rounded-2xl shrink-0 shadow-lg border backdrop-blur-md mt-1 transition-transform", 
                            item.type === "success" ? "bg-green-500/10 border-green-500/20 shadow-green-500/10 text-green-400" :
                            item.type === "warning" ? "bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/10 text-yellow-400" :
                            item.type === "alert" ? "bg-red-500/10 border-red-500/20 shadow-red-500/10 text-red-400" :
                            "bg-blue-500/10 border-blue-500/20 shadow-blue-500/10 text-blue-400"
                        )}>
                            {item.type === "success" && <CheckCircle size={22} strokeWidth={2} />}
                            {item.type === "warning" && <Clock size={22} strokeWidth={2} />}
                            {item.type === "alert" && <AlertTriangle size={22} strokeWidth={2} />}
                            {item.type === "info" && <Info size={22} strokeWidth={2} />}
                        </div>

                        {/* İçerik */}
                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-start gap-4 mb-2">
                                <h3 className={cn("text-base font-bold tracking-tight pr-2", isUnread ? "text-white" : "text-zinc-300")}>
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded-lg border", isUnread ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" : "bg-white/5 border-white/5 text-zinc-500")}>
                                        {item.time}
                                    </span>
                                    {isUnread && (
                                        <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className={cn("text-sm leading-relaxed font-medium", isUnread ? "text-zinc-300" : "text-zinc-500")}>
                                {item.message}
                            </p>
                        </div>
                    </div>
                    )
                })
            )}
        </div>

      </BentoCard>
    </div>
  );
};

export default Notifications;