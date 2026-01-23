import { useState } from "react";
import { TrendingUp, Wallet, CreditCard, Plus } from "lucide-react";
import Sidebar from "./components/layout/Sidebar";
import BentoCard from "./components/ui/BentoCard";
import { useGlobal } from "./context/GlobalContext";
import { formatCurrency, cn } from "./utils/helpers";

function App() {
  const { totalExpenses, subscriptions } = useGlobal();
  const [isCollapsed, setIsCollapsed] = useState(false);


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
    <div className="min-h-screen flex text-slate-50 font-sans bg-[#050505]">
      
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      
      <main 
        className={cn(
          "flex-1 min-h-screen overflow-y-auto p-8 transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-20" : "ml-72"
        )}
      >
        
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl pl-3 font-bold tracking-tight text-gray-300 mb-2">
           Yönetim Paneli
            </h1>
          </div>
        </header>

        {/* üst kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <BentoCard glowColor="orange" className="h-40 items-start! text-left! p-8!">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <Wallet size={20} className="text-orange-500" />
                    </div>
                    <span className="text-m font-bold text-zinc-200 uppercase tracking-wider">Toplam Gİder</span>
                </div>
                <p className="text-4xl font-bold text-white tracking-tight">
                    {formatCurrency(totalExpenses).replace(",00", "")}
                </p>
            </BentoCard>

            <BentoCard glowColor="blue" className="h-40 items-start! text-left! p-8!">
                <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <CreditCard size={20} className="text-blue-300" />
                    </div>
                    <span className="text-m font-bold text-zinc-200 uppercase tracking-wider">Aktİf Abonelİk</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-white">{subscriptions.length}</p>
                </div>
            </BentoCard>

            <BentoCard glowColor="fuchsia" className="h-40 items-start! text-left! p-8!">
                <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <TrendingUp size={20} className="text-purple-300" />
                    </div>
                    <span className="text-m  text-zinc-200 uppercase tracking-wider">En Yüksek</span>
                </div>
                <p className="text-3xl font-bold text-white truncate mb-1">{mostExpensive.name}</p>
                <p className="text-xl text-zinc-100">
                    {formatCurrency(mostExpensive.price)}
                </p>
            </BentoCard>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Aboneliklerim</h2>
          <div className="h-px bg-zinc-800 flex-1 ml-6"></div>
        </div>

        {/* liste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          
          {enhancedSubscriptions.map((sub) => (
            <BentoCard key={sub.id} glowColor={sub.glowColor} className="aspect-4/3 group">
              
              <div className="w-16 h-16 mb-6 rounded-2xl bg-[#131315] border border-white/5 p-3 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 relative z-20">
                <img src={sub.image} alt={sub.name} className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
              </div>

              <h4 className="text-lg font-bold text-white mb-1 relative z-20">{sub.name}</h4>
              <p className="text-sm font-medium text-zinc-500 mb-4 relative z-20">{sub.category}</p>
              
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-sm font-semibold text-zinc-300 group-hover:bg-white/10 transition-colors relative z-20">
                {formatCurrency(sub.price).replace("₺", "").replace(",00", "")} ₺ / Ay
              </div>

            </BentoCard>
          ))}

           {/* yeni servis ekle butonu */}
           <BentoCard glowColor="zinc" className="aspect-4/3 border-dashed border-zinc-800 bg-transparent hover:bg-zinc-900/50">
             <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors relative z-20">
               <Plus size={24} className="text-zinc-500 group-hover:text-white" />
             </div>
             <span className="text-sm font-bold text-zinc-500 group-hover:text-white transition-colors relative z-20">Yeni Servis Ekle</span>
           </BentoCard>

        </div>

      </main>
    </div>
  );
}

export default App;