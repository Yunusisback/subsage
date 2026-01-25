import { useGlobal } from "../../context/GlobalContext";
import BentoCard from "../ui/BentoCard";
import Button from "../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { Trash2, Calendar, Tag } from "lucide-react";

const SubscriptionList = () => {
  const { subscriptions, removeSubscription } = useGlobal();

  if (subscriptions.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-300 rounded-3xl bg-zinc-50/50">
              <p className="text-zinc-500 font-medium">Henüz hiç abonelik eklenmemiş.</p>
          </div>
      )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {subscriptions.map((sub) => (
        <BentoCard key={sub.id} glowColor="zinc" className="aspect-auto min-h-70 group relative flex flex-col justify-between items-start text-left p-6">
            
            {/* İkon ve Sil Butonu */}
            <div className="w-full flex justify-between items-start mb-4 relative z-20">
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-200 p-2.5 flex items-center justify-center shadow-sm">
                     <img 
                        src={sub.image} 
                        alt={sub.name} 
                        onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Infobox_info_icon.svg" }}
                        className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300" 
                    />
                </div>
                
                <Button 
                    variant="danger" 
                    size="icon" 
                    className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    onClick={() => removeSubscription(sub.id)}
                    title="Sil"
                >
                    <Trash2 size={14} />
                </Button>
            </div>

            {/* Bilgiler */}
            <div className="relative z-20 w-full mb-4">
                <h4 className="text-xl font-bold text-zinc-900 mb-1">{sub.name}</h4>
                
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                    <Tag size={12} />
                    <span>{sub.category}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Calendar size={12} />
                    <span>{sub.startDate}</span>
                </div>
            </div>
            
            {/* Fiyat */}
            <div className="w-full relative z-20 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-sm text-zinc-500">Aylık Ödeme</span>
                <span className="text-lg font-bold text-zinc-900">
                     {formatCurrency(sub.price).replace("₺", "")} ₺
                </span>
            </div>

        </BentoCard>
      ))}
    </div>
  );
};

export default SubscriptionList;