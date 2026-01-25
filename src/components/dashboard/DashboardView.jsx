import BentoCard from "../ui/BentoCard";
import { Plus, ChevronRight } from "lucide-react";
import { useGlobal } from "../../context/GlobalContext";
import { formatCurrency } from "../../utils/helpers";
import { TABS } from "../../utils/constants";

const DashboardView = ({ setActiveTab }) => {
  const { totalExpenses, subscriptions } = useGlobal();

  // Dashboard hesaplamaları
  const enhancedSubscriptions = subscriptions.map(sub => {
    
    // Her servis için farklı bir ilerleme yüzdesi 
    let progressValue = 50; 
    if (sub.name === "Netflix") progressValue = 85;
    else if (sub.name === "Spotify") progressValue = 45;
    else if (sub.name === "Amazon Prime") progressValue = 95;
    else if (sub.name === "YouTube Premium") progressValue = 100;
    else if (sub.name === "iCloud+") progressValue = 25;
    else progressValue = Math.floor(Math.random() * 60) + 20; 

    return {
      ...sub,
      progress: progressValue,
      glowColor: sub.name === "Netflix" ? "red"
        : sub.name === "Spotify" ? "green"
          : sub.name === "Amazon Prime" ? "blue"
            : sub.name === "YouTube Premium" ? "red"
              : "zinc"
    };
  });

  const mostExpensive = subscriptions.reduce((prev, current) => {
    return (parseFloat(prev.price) > parseFloat(current.price)) ? prev : current;
  }, subscriptions[0] || { name: '-', price: 0 });



  //  toplam gider grafiği
  const SpendingGraphIcon = () => (
    <div className="flex items-end gap-0.75 h-5">
        <div className="w-1.5 h-2 bg-orange-400 rounded-sm opacity-60"></div>
        <div className="w-1.5 h-4 bg-orange-500 rounded-sm opacity-80"></div>
        <div className="w-1.5 h-3 bg-orange-400 rounded-sm opacity-70"></div>
        <div className="w-1.5 h-5 bg-orange-600 rounded-sm shadow-sm"></div>
    </div>
  );

  // Aktif Abonelik Grafiği 
  const ActiveSubsIcon = () => (
    <div className="flex flex-col gap-0.75 w-5 justify-center">
        <div className="w-5 h-1.5 bg-blue-400 rounded-full opacity-60"></div>
        <div className="w-3 h-1.5 bg-blue-500 rounded-full opacity-80"></div>
        <div className="w-4 h-1.5 bg-blue-600 rounded-full shadow-sm"></div>
    </div>
  );

  //En Yüksek Gider Grafiği
  const HighestExpenseIcon = () => (
    <div className="flex items-end gap-0.75 h-5">
       <div className="w-1.5 h-2 bg-fuchsia-300 rounded-sm opacity-50"></div>
       <div className="w-1.5 h-2.5 bg-fuchsia-400 rounded-sm opacity-60"></div>
       <div className="w-1.5 h-5 bg-fuchsia-600 rounded-sm shadow-sm"></div> 
       <div className="w-1.5 h-1.5 bg-fuchsia-300 rounded-sm opacity-50"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">

      {/* Üst Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        {/* Toplam Gider Kartı */}
        <BentoCard glowColor="orange" className="h-40 relative overflow-hidden group p-6 items-start text-left">
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-orange-50/50 border border-orange-100/50 backdrop-blur-sm shadow-sm">
                 <SpendingGraphIcon />
              </div>
              <span className="text-[15px] font-bold text-orange-600 uppercase tracking-wider">Toplam Gİder</span>
            </div>

            <div>
              <div className="flex items-baseline gap-1 ">
                <p className="text-4xl font-black text-zinc-900 tracking-tighter transition-transform duration-300 group-hover:scale-105 origin-left mt-5 mr-1">
                  {formatCurrency(totalExpenses).replace(",00", "")}
                </p>
                <span className="text-zinc-500 text-xl font-bold">/ay</span>
              </div>
            </div>
          </div>

          {/* Arka Plan Süsü */}
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                 <path d="M3 3v18h18" />
                 <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
             </svg>
          </div>
        </BentoCard>

        {/* Aktif Abonelik Kartı */}
        <BentoCard glowColor="blue" className="h-40 relative overflow-hidden group p-6 items-start text-left">
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100/50 backdrop-blur-sm shadow-sm">
                <ActiveSubsIcon />
              </div>
              <span className="text-[15px] font-bold text-blue-500 uppercase tracking-wider">Aktİf Abonelİk</span>
            </div>

            <div className="flex items-end justify-between mt-4">
              <p className="text-5xl font-black text-zinc-900 tracking-tighter pt-2">
                {subscriptions.length}
                <span className="text-blue-600 text-2xl font-medium tracking-wide ml-2 text italic">servis</span>
              </p>
            </div>
          </div>
          
          {/* Arka Plan Süsü */}
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
             <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                 <circle cx="12" cy="12" r="10" />
                 <circle cx="12" cy="12" r="6" />
                 <circle cx="12" cy="12" r="2" />
             </svg>
          </div>
        </BentoCard>

        {/* En Yüksek Gider Kartı */}
        <BentoCard glowColor="fuchsia" className="h-40 relative overflow-hidden group p-6 items-start text-left">

          {/* Ana kapsayıcı*/}
          <div className="relative z-10 flex flex-col mb-10 justify-between h-full w-full">

            {/* İkon ve Başlık  */}
            <div className="flex items-center gap-4 mt-1">
              <div className="p-2 rounded-xl bg-fuchsia-50/50 border border-fuchsia-100/50 backdrop-blur-sm shadow-sm">
                <HighestExpenseIcon />
              </div>
              <span className="text-[16px] font-bold text-fuchsia-500 uppercase tracking-wider">En Yüksek</span>
            </div>

            {/* İsim ve Fiyat container */}
            <div className="flex items-end justify-between w-full">

              {/* Netflix Yazısı */}
              <div className="flex flex-col justify-end mb-2">
                <p className="text-3xl font-bold text-zinc-900 leading-none truncate max-w-37.5">
                  {mostExpensive.name}
                </p>
              </div>

              {/* Fiyat */}
              <p className="text-3xl font-black text-fuchsia-600 tracking-tighter leading-none mr-5 mb-2">
                {formatCurrency(mostExpensive.price)}
              </p>

            </div>

          </div>
          {/* Arka Plan Süsü */}
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
             <svg width="130" height="130" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-fuchsia-500 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                 <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                 <polyline points="16 7 22 7 22 13" />
             </svg>
          </div>
        </BentoCard>

      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-yellow-800 flex items-center gap-2">
          Son Abonelikler
        </h2>
        <div className="h-px bg-yellow-500 flex-1 ml-6"></div>
      </div>

      {/* Dashboard Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {enhancedSubscriptions.slice(0, 4).map((sub) => (
          <BentoCard key={sub.id} glowColor={sub.glowColor} className="aspect-4/3 group relative overflow-hidden p-5 flex flex-col justify-between items-start text-left">

            {/* Logo ve Kategori */}
            <div className="relative z-20 flex justify-between items-start w-full">
              <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 p-2 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:border-zinc-200 transition-all duration-300">
                <img
                  src={sub.image}
                  alt={sub.name}
                  onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Infobox_info_icon.svg" }}
                  className="w-full h-full object-contain filter"
                />
              </div>
            </div>

            {/* İsim ve Bilgi */}
            <div className="relative z-20 mt-4 w-full">
              <h4 className="text-xl font-black text-zinc-900 mb-4.5 tracking-tight group-hover:translate-x-1 transition-transform duration-300 truncate">
                {sub.name}
              </h4>
           
            </div>

            {/* Fiyat ve İlerleme  */}
            <div className="relative z-20 space-y-2 w-full">

              {/* Ödeme döngüsü çizgisi */}
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden flex justify-start">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${sub.progress}%`, 
                    backgroundColor: sub.glowColor === "red" ? "#ef4444" : sub.glowColor === "blue" ? "#3b82f6" : sub.glowColor === "green" ? "#22c55e" : "#71717a" 
                  }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none mb-1">Aylık</span>
                  <div className="text-lg font-black text-zinc-900 flex items-baseline gap-1">
                    {formatCurrency(sub.price).replace("₺", "").replace(",00", "")}
                    <span className="text-sm font-bold text-zinc-400">₺</span>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-100 opacity-0 group-hover:opacity-100 group-hover:bg-zinc-100 transition-all duration-300">
                  <ChevronRight size={16} className="text-zinc-600" />
                </div>
              </div>
            </div>

            {/* Arka Plan */}
            <div className="absolute -right-2 -top-2 w-36 h-36 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700 pointer-events-none rotate-12">
              <img src={sub.image} alt="" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>

          </BentoCard>
        ))}

        {/* Ekle Kartı */}
        <BentoCard
          glowColor="zinc"
          className="aspect-4/3 border-dashed border-zinc-300 bg-zinc-50/50 hover:bg-zinc-100 cursor-pointer flex flex-col items-center justify-center group shadow-none"
          onClick={() => setActiveTab(TABS.SUBSCRIPTIONS)}
        >
          <div className="w-12 h-12 mb-3 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:border-zinc-300 transition-colors relative z-20 shadow-sm">
            <Plus size={24} className="text-zinc-400 group-hover:text-zinc-600" />
          </div>
          <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-600 transition-colors relative z-20">Yeni Ekle</span>
        </BentoCard>
      </div>
    </div>
  );
};

export default DashboardView;