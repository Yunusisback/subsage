import { Bell, CheckCircle, AlertTriangle, Info, Clock, } from "lucide-react";
import BentoCard from "../ui/BentoCard";
import { cn } from "../../utils/helpers";

const NOTIFICATIONS_DATA = [
  {
    id: 1,
    type: "success",
    title: "Ödeme Başarılı",
    message: "Netflix abonelik ücretiniz (199.99₺) başarıyla ödendi.",
    time: "2 saat önce",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Yaklaşan Ödeme",
    message: "Spotify ödemeniz 2 gün içinde gerçekleşecek. Bakiyenizi kontrol edin.",
    time: "5 saat önce",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Yeni Özellik",
    message: "Artık harcama raporlarınızı PDF olarak indirebilirsiniz.",
    time: "1 gün önce",
    read: true,
  },
  {
    id: 4,
    type: "alert",
    title: "Sistem Bakımı",
    message: "Bu gece 03:00 - 05:00 arası planlı bakım çalışması yapılacaktır.",
    time: "2 gün önce",
    read: true,
  },
];

const Notifications = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      <BentoCard glowColor="zinc" className="p-0 flex flex-col min-h-150">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Bell className="text-yellow-500" />
                    Bildirim Merkezi
                </h2>
                <p className="text-zinc-400 text-sm mt-1">Tüm hesap hareketleriniz ve sistem uyarıları.</p>
            </div>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors">
                Tümünü okundu işaretle
            </button>
        </div>

        {/* Liste */}
        <div className="p-6 space-y-4">
            {NOTIFICATIONS_DATA.map((item) => (
                <div 
                    key={item.id} 
                    className={cn(
                        "group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300",
                        item.read 
                            ? "bg-transparent border-white/5 hover:bg-white/5" 
                            : "bg-[#0C0C0E] border-l-4 border-l-yellow-500 border-y-white/10 border-r-white/10 shadow-lg"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-full shrink-0",
                        item.type === "success" ? "bg-green-500/20 text-green-400" :
                        item.type === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                        item.type === "alert" ? "bg-red-500/20 text-red-400" :
                        "bg-blue-500/20 text-blue-400"
                    )}>
                        {item.type === "success" && <CheckCircle size={20} />}
                        {item.type === "warning" && <Clock size={20} />}
                        {item.type === "alert" && <AlertTriangle size={20} />}
                        {item.type === "info" && <Info size={20} />}
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className={cn("font-bold text-base mb-1", item.read ? "text-zinc-400" : "text-white")}>
                                {item.title}
                            </h3>
                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                {item.time}
                                {!item.read && <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>}
                            </span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            {item.message}
                        </p>
                    </div>
                </div>
            ))}
        </div>

      </BentoCard>
    </div>
  );
};

export default Notifications;