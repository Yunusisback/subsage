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
            className={cn(
                "group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95",
                "text-zinc-600 dark:text-zinc-300",
                "bg-white dark:bg-zinc-900/80",
                "border border-zinc-200 dark:border-zinc-700/60",
                "shadow-sm hover:shadow-md",
                "hover:border-yellow-300 dark:hover:border-yellow-600/50",
                "hover:bg-yellow-50 dark:hover:bg-yellow-500/8",
                "hover:text-yellow-800 dark:hover:text-yellow-400",
                "backdrop-blur-sm"
            )}
        >
            <div className={cn(
                "p-1 rounded-full transition-colors",
                "bg-zinc-100 dark:bg-zinc-800",
                "group-hover:bg-yellow-200 dark:group-hover:bg-yellow-500/20",
                "group-hover:text-yellow-700 dark:group-hover:text-yellow-400"
            )}>
                 <Check size={12} strokeWidth={3} />
            </div>
            Tümünü okundu işaretle
        </button>
      </div>

       {/* bildirim listesi */}
      <div className="space-y-3 w-full">
          {notifications.length === 0 ? (
                <div className={cn(
                    "flex flex-col items-center justify-center py-16 rounded-3xl border border-dashed text-center",
                    "bg-white dark:bg-zinc-900/50",
                    "border-zinc-200 dark:border-zinc-700/50"
                )}>
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-4 border",
                        "bg-zinc-50 dark:bg-zinc-800",
                        "border-zinc-100 dark:border-zinc-700/50"
                    )}>
                        <Bell size={24} className="text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 dark:text-zinc-500 font-medium">Hiç yeni bildiriminiz yok.</p>
                </div>
          ) : (
              notifications.map((item) => {
                  const isUnread = !item.read;

                  const typeStyles = {
                      success: { 
                          card: "bg-emerald-50/70 dark:bg-emerald-500/5 border-emerald-200/70 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/35", 
                          iconBg: "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                          highlight: "bg-emerald-500"
                      },
                      warning: { 
                          card: "bg-red-50/70 dark:bg-red-500/5 border-red-200/70 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/35", 
                          iconBg: "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400",
                          highlight: "bg-red-500"
                      },
                      alert: { 
                          card: "bg-amber-50/70 dark:bg-amber-500/5 border-amber-200/70 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/35", 
                          iconBg: "bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
                          highlight: "bg-amber-500"
                      },
                      info: { 
                          card: "bg-blue-50/70 dark:bg-blue-500/5 border-blue-200/70 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/35", 
                          iconBg: "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
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
                              : cn(
                                  "bg-white dark:bg-zinc-900/60",
                                  "border-zinc-100 dark:border-zinc-800/60",
                                  "hover:border-zinc-200 dark:hover:border-zinc-700/60",
                                  "hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40",
                                  "opacity-60 hover:opacity-100"
                              )
                      )}
                  >
              
                      {isUnread && (
                          <div className={cn("absolute left-0 top-6 bottom-6 w-1 rounded-r-full opacity-60", style.highlight)} />
                      )}

                      {/* İkon */}
                      <div className={cn(
                          "p-3 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110", 
                          isUnread 
                              ? style.iconBg 
                              : cn(
                                  "border",
                                  "bg-zinc-100 dark:bg-zinc-800/80",
                                  "border-zinc-200 dark:border-zinc-700/50",
                                  "text-zinc-400 dark:text-zinc-500"
                              )
                      )}>
                          {item.type === "success" && <CheckCircle size={20} strokeWidth={2.5} />}
                          {item.type === "warning" && <Clock size={20} strokeWidth={2.5} />}
                          {item.type === "alert" && <XCircle size={20} strokeWidth={2.5} />}
                          {item.type === "info" && <Info size={20} strokeWidth={2.5} />}
                      </div>

                      {/* İçerik */}
                      <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex justify-between items-start gap-4 mb-1.5">
                              <h3 className={cn(
                                  "text-sm font-bold tracking-tight",
                                  isUnread 
                                      ? "text-zinc-900 dark:text-zinc-100" 
                                      : "text-zinc-500 dark:text-zinc-400"
                              )}>
                                  {item.title}
                              </h3>
                              <span className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 transition-colors", 
                                  isUnread 
                                      ? "bg-white/60 dark:bg-zinc-900/60 border-black/5 dark:border-white/8 text-zinc-600 dark:text-zinc-300 backdrop-blur-sm" 
                                      : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/50 text-zinc-400 dark:text-zinc-500"
                              )}>
                                  {item.time}
                              </span>
                          </div>
                          <p className={cn(
                              "text-xs leading-relaxed",
                              isUnread 
                                  ? "text-zinc-700 dark:text-zinc-300 font-medium" 
                                  : "text-zinc-400 dark:text-zinc-500"
                          )}>
                              {item.message}
                          </p>
                      </div>

                   
                      {isUnread && (
                          <div className="absolute top-5 right-5 flex h-2.5 w-2.5">
                              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-60", style.highlight)}></span>
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