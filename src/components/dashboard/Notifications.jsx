import { CheckCircle, Info, Clock, Check, Bell, XCircle } from "lucide-react";
import { cn } from "../../utils/helpers";
import { useUI } from "../../context/UIContext"; 

const Notifications = () => {

  const { notifications, markAllNotificationsAsRead } = useUI();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mr-auto pb-15 -mt-4">
      
      {/*  başlık ve tümünü okundu işaretle butonu */} 
      <div className="flex justify-end mb-6">
        <button 
            onClick={markAllNotificationsAsRead}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-800 transition-all duration-300 cursor-pointer active:scale-95"
        >
            <div className="p-1 rounded-full bg-zinc-100 group-hover:bg-yellow-200 group-hover:text-yellow-700 transition-colors">
                 <Check size={12} strokeWidth={3} />
            </div>
            Tümünü okundu işaretle
        </button>
      </div>

       {/* bildirim listesi */}
      <div className="space-y-4 w-full">
          {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-zinc-200 text-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                        <Bell size={24} className="text-zinc-300" />
                    </div>
                    <p className="text-zinc-500 font-medium">Hiç yeni bildiriminiz yok.</p>
                </div>
          ) : (
              notifications.map((item) => {
                  const isUnread = !item.read;

                  
                  const typeStyles = {
                      success: { 
                          card: "bg-emerald-50/80 border-emerald-200/60 hover:border-emerald-300", 
                          iconBg: "bg-emerald-100 text-emerald-600",
                          highlight: "bg-emerald-500"
                      },
                      warning: { 
                          card: "bg-amber-50/80 border-amber-200/60 hover:border-amber-300", 
                          iconBg: "bg-amber-100 text-amber-600",
                          highlight: "bg-amber-500"
                      },
                      alert: { 
                          card: "bg-red-50/80 border-red-200/60 hover:border-red-300", 
                          iconBg: "bg-red-100 text-red-600",
                          highlight: "bg-red-500"
                      },
                      info: { 
                          card: "bg-blue-50/80 border-blue-200/60 hover:border-blue-300", 
                          iconBg: "bg-blue-100 text-blue-600",
                          highlight: "bg-blue-500"
                      },
                  };

                  const style = typeStyles[item.type] || typeStyles.info;

                  return (
                  <div 
                      key={item.id} 
                      className={cn(
                          "group relative flex items-start gap-5 p-5 rounded-2xl transition-all duration-300 border w-full",
                        
                          isUnread 
                              ? cn(style.card, "shadow-sm hover:shadow-md hover:-translate-y-0.5") 
                              : "bg-white border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/80 opacity-75 hover:opacity-100"
                      )}
                  >
                      {/* okunmamış bildirim arkaplanı */}
                      {isUnread && (
                          <div className={cn("absolute left-0 top-6 bottom-6 w-1 rounded-r-full opacity-60", style.highlight)} />
                      )}

                      {/* İkon */}
                      <div className={cn(
                          "p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110", 
                          isUnread ? style.iconBg : "bg-zinc-100 text-zinc-400"
                      )}>
                          {item.type === "success" && <CheckCircle size={20} strokeWidth={2.5} />}
                          {item.type === "warning" && <Clock size={20} strokeWidth={2.5} />}
                          {item.type === "alert" && <XCircle size={20} strokeWidth={2.5} />}
                          {item.type === "info" && <Info size={20} strokeWidth={2.5} />}
                      </div>

                      {/* İçerik */}
                      <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex justify-between items-start gap-4 mb-1.5">
                              <h3 className={cn("text-sm font-bold tracking-tight", isUnread ? "text-zinc-900" : "text-zinc-600")}>
                                  {item.title}
                              </h3>
                              <span className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0", 
                                  isUnread ? "bg-white/60 border-black/5 text-zinc-600 backdrop-blur-sm" : "bg-zinc-100 border-zinc-200 text-zinc-400"
                              )}>
                                  {item.time}
                              </span>
                          </div>
                          <p className={cn("text-xs leading-relaxed", isUnread ? "text-zinc-700 font-medium" : "text-zinc-400")}>
                              {item.message}
                          </p>
                      </div>

                       {/* Okunmamış bildirim noktası */}
                      {isUnread && (
                          <div className="absolute top-5 right-5 flex h-2.5 w-2.5">
                              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", style.highlight)}></span>
                              <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", style.highlight)}></span>
                          </div>
                      )}
                  </div>
                  )
              })
          )}
      </div>

    </div>
  );
};

export default Notifications;