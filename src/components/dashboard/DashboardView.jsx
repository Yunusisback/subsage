import BentoCard from "../ui/BentoCard";
import { Wallet, CreditCard, TrendingUp, Plus } from "lucide-react";
import { useGlobal } from "../../context/GlobalContext";
import { formatCurrency } from "../../utils/helpers";
import { TABS } from "../../utils/constants";

const DashboardView = ({ setActiveTab }) => {
  const { totalExpenses, subscriptions } = useGlobal();

  // Dashboard hesaplamaları
  const enhancedSubscriptions = subscriptions.map(sub => ({
    ...sub,
    glowColor: sub.name === "Netflix" ? "red" 
             : sub.name === "Spotify" ? "green"
             : sub.name === "Amazon Prime" ? "blue"
             : sub.name === "YouTube Premium" ? "red"
             : "zinc"
  }));

  const mostExpensive = subscriptions.reduce((prev, current) => {
    return (prev.price > current.price) ? prev : current;
  }, subscriptions[0] || { name: '-', price: 0 });

  return (

    <div className="animate-in fade-in zoom-in-95 duration-500">

      {/* Üst Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <BentoCard glowColor="orange" className="h-40 items-start! text-left! p-8!">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                      <Wallet size={20} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Toplam Gider</span>
              </div>
              <p className="text-4xl font-black text-white tracking-tight">
                  {formatCurrency(totalExpenses).replace(",00", "")}
              </p>
          </BentoCard>

          <BentoCard glowColor="blue" className="h-40 items-start! text-left! p-8!">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                      <CreditCard size={20} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Aktif Abonelik</span>
              </div>
              <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-white">{subscriptions.length}</p>
              </div>
          </BentoCard>

          <BentoCard glowColor="fuchsia" className="h-40 items-start! text-left! p-8!">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                      <TrendingUp size={20} className="text-fuchsia-400" />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">En Yüksek</span>
              </div>
              <p className="text-3xl font-bold text-white truncate mb-1">{mostExpensive.name}</p>
              <p className="text-xl text-zinc-400 font-medium">
                  {formatCurrency(mostExpensive.price)}
              </p>
          </BentoCard>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Son Abonelikler
        </h2>
        <div className="h-px bg-white/5 flex-1 ml-6"></div>
      </div>

      {/* Dashboard Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {enhancedSubscriptions.slice(0, 4).map((sub) => (
          <BentoCard key={sub.id} glowColor={sub.glowColor} className="aspect-4/3 group relative">
            <div className="w-14 h-14 mb-4 rounded-2xl bg-[#131315] border border-white/5 p-2.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 relative z-20">
              <img src={sub.image} alt={sub.name} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1 relative z-20">{sub.name}</h4>
            <p className="text-xs font-semibold text-zinc-500 mb-4 uppercase tracking-wider relative z-20">{sub.category}</p>
            
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-sm font-bold text-zinc-200 group-hover:bg-white/10 group-hover:border-white/10 transition-colors relative z-20">
              {formatCurrency(sub.price).replace("₺", "").replace(",00", "")} ₺ <span className="text-xs text-zinc-500 font-normal">/ Ay</span>
            </div>
          </BentoCard>
        ))}

         {/*Ekle Kartı */}
         <BentoCard 
           glowColor="zinc" 
           className="aspect-4/3 border-dashed border-zinc-800 bg-transparent hover:bg-zinc-900/30 cursor-pointer"
           onClick={() => setActiveTab(TABS.SUBSCRIPTIONS)} 
         >
           <div className="w-14 h-14 mb-3 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-600 transition-colors relative z-20">
             <Plus size={24} className="text-zinc-500 group-hover:text-white" />
           </div>
           <span className="text-sm font-bold text-zinc-500 group-hover:text-white transition-colors relative z-20">Yeni Ekle</span>
         </BentoCard>
      </div>
    </div>
  );
};

export default DashboardView;