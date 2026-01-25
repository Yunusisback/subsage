import { CheckCircle, AlertTriangle, Info, Clock, Check } from "lucide-react";
import { cn } from "../../utils/helpers";
import { useGlobal } from "../../context/GlobalContext";

const Notifications = () => {
  const { notifications, markAllNotificationsAsRead } = useGlobal();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mr-auto pb-15 pt-2">
      
      {/* Üst Kısım */}
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

      {/* Liste  */}
      <div className="space-y-4 w-full">
          {notifications.length === 0 ? (
                <div className="text-center text-zinc-400 py-10 font-medium bg-white rounded-2xl border border-dashed border-zinc-200">
                    Hiç bildiriminiz yok.
                </div>
          ) : (
              notifications.map((item) => {
                  const isUnread = !item.read;
                  return (
                  <div 
                      key={item.id} 
                      className={cn(
                     
                          "group relative flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 border w-full hover:scale-[1.01]",
                          isUnread 
                              ? "bg-white border-l-4 border-l-yellow-400 border-y-zinc-200 border-r-zinc-200 shadow-sm" 
                              : "bg-white/60 border-zinc-200 hover:bg-white hover:border-zinc-300 shadow-sm"
                      )}
                  >
                      {/* İkon */}
                      <div className={cn(
                          "p-3 rounded-xl shrink-0 shadow-sm border transition-transform", 
                          item.type === "success" ? "bg-green-50 border-green-100 text-green-600" :
                          item.type === "warning" ? "bg-yellow-50 border-yellow-100 text-yellow-600" :
                          item.type === "alert" ? "bg-red-50 border-red-100 text-red-600" :
                          "bg-blue-50 border-blue-100 text-blue-600"
                      )}>
                          {item.type === "success" && <CheckCircle size={22} strokeWidth={2} />}
                          {item.type === "warning" && <Clock size={22} strokeWidth={2} />}
                          {item.type === "alert" && <AlertTriangle size={22} strokeWidth={2} />}
                          {item.type === "info" && <Info size={22} strokeWidth={2} />}
                      </div>

                      {/* İçerik */}
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-4 mb-1">
                              <h3 className={cn("text-sm font-bold tracking-tight", isUnread ? "text-zinc-900" : "text-zinc-600")}>
                                  {item.title}
                              </h3>
                              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded border whitespace-nowrap shrink-0", isUnread ? "bg-yellow-50 border-yellow-100 text-yellow-700" : "bg-zinc-100 border-zinc-200 text-zinc-500")}>
                                  {item.time}
                              </span>
                          </div>
                          <p className={cn("text-xs leading-relaxed font-medium", isUnread ? "text-zinc-600" : "text-zinc-400")}>
                              {item.message}
                          </p>
                      </div>

                      {/* Okunmamış Noktası */}
                      {isUnread && (
                          <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 hidden sm:flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
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