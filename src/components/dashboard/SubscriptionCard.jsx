import { CreditCard } from "lucide-react";
import BentoCard from "../ui/BentoCard";
import { cn } from "../../utils/helpers";
import { SERVICE_LOGOS } from "../../utils/constants";

const SubscriptionCard = ({ sub, formatMoney }) => {
  return (
    <BentoCard
        key={sub.id}
        className={cn(
            "group relative overflow-hidden p-6 flex flex-col justify-between transition-all duration-500 border rounded-4xl select-none",
            "bg-white dark:bg-zinc-900/40 backdrop-blur-md shadow-sm hover:shadow-2xl hover:-translate-y-1.5",
            sub.theme.border 
        )}
    >
        {/* logo ve isim */}
        <div className="flex items-center justify-between w-full mb-6 z-10 tracking-wide">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-14 h-14 rounded-[1.25rem] p-2.5 flex items-center justify-center shadow-sm border transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3", 
                    "bg-white dark:bg-zinc-800/80 dark:border-zinc-700/50",
                    sub.theme.border
                )}>
                    <img
                        src={sub.image || SERVICE_LOGOS.DEFAULT}
                        alt={sub.name}
                        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = SERVICE_LOGOS.DEFAULT;
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <h4 className="text-lg font-extrabold text-zinc-800 dark:text-zinc-100 leading-tight tracking-wide group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {sub.name}
                    </h4>
                    <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-tighter opacity-80">
                        {sub.category || "Abonelik"}
                    </span>
                </div>
            </div>
        </div>

        {/* yenilenme barı */}          
        <div className="w-full z-10 mt-auto mb-1">
            <div className="flex justify-between items-end mb-2.5">
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest opacity-80">Yenilenme</span>
            
                <div className={cn(
                    "text-[10px] font-black px-2.5 py-1 rounded-xl shadow-xs ring-2 transition-colors", 
                    "bg-zinc-50 dark:bg-zinc-800/80 dark:border-zinc-700/50",
                    sub.theme.subtext
                )}>
                    {sub.daysLeft === 0 ? "Bugün" : `${sub.daysLeft} GÜN KALDI`}
                </div>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden shadow-inner p-0.5 border border-zinc-200/20 dark:border-zinc-700/30">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 bg-linear-to-r shadow-[0_0_12px_rgba(0,0,0,0.1)]", sub.theme.gradient)}
                    style={{ width: `${sub.progress}%` }}
                />
            </div>
        </div>

        {/* alt kısım fiyat*/}
        <div className="w-full flex justify-between items-center mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 z-10 relative">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/50 tracking-wider">
                <CreditCard size={14} className={cn("transition-colors", sub.theme.subtext)} />
                <span>Otomatik</span>
            </div>
            <div className="text-2xl lg:text-3xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums tracking-tighter group-hover:scale-105 origin-right transition-transform duration-500">
                {formatMoney(sub.price)} <span className="text-xl font-bold text-zinc-400 dark:text-zinc-500/60 ml-0.5">₺</span>
            </div>
        </div>

       
        <div className={cn(
            "absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none transition-all duration-700 group-hover:opacity-15 group-hover:scale-110", 
            sub.theme.bar 
        )}></div>
        
    </BentoCard>
  );
};

export default SubscriptionCard;