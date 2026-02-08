import { CreditCard } from "lucide-react";
import BentoCard from "../ui/BentoCard";
import { cn } from "../../utils/helpers";
import { SERVICE_LOGOS } from "../../utils/constants";

const SubscriptionCard = ({ sub, formatMoney }) => {
  return (
    <BentoCard
        key={sub.id}
        className={cn(
            "group relative overflow-hidden p-5 flex flex-col justify-between transition-all duration-300 border shadow-sm hover:shadow-md rounded-3xl bg-white select-none",
            sub.theme.border
        )}
    >
        {/* Logo ve İsim */}
        <div className="flex items-start justify-between w-full mb-4 z-10">
            <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-2xl p-2.5 flex items-center justify-center shadow-sm border transition-transform group-hover:scale-105 bg-white", sub.theme.border)}>
                    <img
                        src={sub.image || SERVICE_LOGOS.DEFAULT}
                        alt={sub.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.target.src = SERVICE_LOGOS.DEFAULT;
                        }}
                    />
                </div>
                <div>
                    <h4 className="text-base lg:text-lg font-bold text-slate-900 leading-tight">{sub.name}</h4>
                </div>
            </div>
        </div>

        {/* Tarih ve Progress */}
        <div className="w-full z-10 mt-auto">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-slate-400">Yenilenme</span>
            
                <span className={cn("text-xs font-bold", sub.theme.subtext)}>
                    {sub.daysLeft === 0 ? "Bugün" : `${sub.daysLeft} gün kaldı`}
                </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-1000 bg-linear-to-r", sub.theme.gradient)}
                    style={{ width: `${sub.progress}%` }}
                />
            </div>
        </div>

        {/* alt kısım fiyat*/}
        <div className="w-full flex justify-between items-center mt-3 pt-3 border-t border-slate-100 z-10">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <CreditCard size={15} />
                <span>Otomatik</span>
            </div>
            <div className="text-lg lg:text-3xl font-black text-slate-900 tabular-nums tracking-tight">
                {formatMoney(sub.price)} <span className="text-xl font-bold text-slate-600">₺</span>
            </div>
        </div>

        {/* arka plan glow */}
        <div className={cn("absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[60px] opacity-20 pointer-events-none", sub.theme.bar)}></div>
    </BentoCard>
  );
};

export default SubscriptionCard;