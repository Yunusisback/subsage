import { CreditCard } from "lucide-react";
import BentoCard from "../ui/BentoCard";
import { cn } from "../../utils/helpers";
import { SERVICE_LOGOS } from "../../utils/constants";

const SubscriptionCard = ({ sub, formatMoney }) => {
  return (
    <BentoCard
        key={sub.id}
        className={cn(
          
            "group relative overflow-hidden p-6 flex flex-col justify-between transition-all duration-500 border rounded-4xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 select-none",
            sub.theme.border
        )}
    >
     

        {/* logo ve isim */}
        <div className="flex items-center justify-between w-full mb-6 z-10 tracking-wide">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-14 h-14 rounded-[1.25rem] p-3 flex items-center justify-center shadow-sm border transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 bg-white", 
                    sub.theme.border
                )}>
                    <img
                        src={sub.image || SERVICE_LOGOS.DEFAULT}
                        alt={sub.name}
                        className="w-full h-full object-contain drop-shadow-sm"
                        onError={(e) => {
                            e.target.src = SERVICE_LOGOS.DEFAULT;
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <h4 className="text-lg font-extrabold text-zinc-800 leading-tight tracking-wide group-hover:text-zinc-700 transition-colors">{sub.name}</h4>
             
                    <span className="text-xs font-medium text-zinc-400 mt-0.5">Abonelik</span>
                </div>
            </div>
        </div>

        {/* yenilenme barı */}          
        <div className="w-full z-10 mt-auto mb-1">
            <div className="flex justify-between items-end mb-2.5">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Yenilenme</span>
            
                <div className={cn("text-xs font-bold px-2.5 py-1 rounded-xl bg-white shadow-sm border border-zinc-100", sub.theme.subtext)}>
                    {sub.daysLeft === 0 ? "Bugün" : `${sub.daysLeft} gün kaldı`}
                </div>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner p-0.5">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 bg-linear-to-r shadow-sm", sub.theme.gradient)}
                    style={{ width: `${sub.progress}%` }}
                />
            </div>
        </div>

        {/* alt kısım fiyat*/}
        <div className="w-full flex justify-between items-center mt-5 pt-4 border-t border-zinc-100 z-10 relative">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200">
                <CreditCard size={16} className="text-zinc-500" />
                <span>Otomatik</span>
            </div>
            <div className="text-2xl lg:text-3xl font-black text-zinc-900 tabular-nums tracking-tighter group-hover:scale-105 origin-right transition-transform duration-500">
                {formatMoney(sub.price)} <span className="text-xl font-bold text-zinc-500">₺</span>
            </div>
        </div>

    
        <div className={cn("absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-2xl opacity-15 pointer-events-none transition-opacity duration-500 group-hover:opacity-25", sub.theme.bar)}></div>
        
    
    </BentoCard>
  );
};

export default SubscriptionCard;