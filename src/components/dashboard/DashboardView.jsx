import BentoCard from "../ui/BentoCard";
import { Wallet, CreditCard, TrendingUp, Plus, ChevronRight } from "lucide-react";
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
    return (parseFloat(prev.price) > parseFloat(current.price)) ? prev : current;
  }, subscriptions[0] || { name: '-', price: 0 });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">

      {/* Üst Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        {/* Toplam Gider Kartı */}
        <BentoCard glowColor="orange" className="h-40 relative overflow-hidden group p-6">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-linear-to-b from-orange-500/20 to-orange-500/5 border border-orange-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-md group-hover:border-orange-500/40 transition-colors duration-300">
                <Wallet
                  size={21}
                  className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                />
              </div>
              <span className="text-[15px] font-bold text-orange-400 uppercase tracking-[0.2em]">Toplam Gİder</span>
            </div>

            <div>
              <div className="flex items-baseline gap-1 ">
                <p className="text-4xl font-black text-white tracking-tighter transition-transform duration-300 group-hover:scale-105 origin-left mt-4 mr-1">
                  {formatCurrency(totalExpenses).replace(",00", "")}
                </p>
                <span className="text-orange-500/90  text-xl font-bold">/ay</span>
              </div>
            </div>
          </div>

          {/* Arka Plan Süsü */}
          <Wallet size={120} className="absolute -right-8 -bottom-8 text-orange-500/10 -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
        </BentoCard>

        {/* Aktif Abonelik Kartı */}
        <BentoCard glowColor="blue" className="h-40 relative overflow-hidden group p-6">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-linear-to-b from-blue-500/20 to-blue-500/5 border border-blue-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-md group-hover:border-blue-500/40 transition-colors duration-300">
                <CreditCard
                  size={21}
                  className="text-blue-400 drop-shadow-[0_0_8px_rgba(98,165,250,1.1)]"
                />
              </div>
              <span className="text-[15px] font-bold text-blue-200 uppercase tracking-[0.2em]">Aktİf Abonelİk</span>
            </div>

            <div className="flex items-end justify-between mt-3">
              <p className="text-5xl font-black text-white tracking-tighter pt-2">
                {subscriptions.length}
                <span className="text-blue-400 text-xl font-medium tracking-wide ml-2 text italic">servis</span>
              </p>
            </div>
          </div>
          
          {/* Arka Plan Süsü */}
          <CreditCard size={120} className="absolute -right-8 -bottom-8 text-blue-400/15 -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
        </BentoCard>

        {/* En Yüksek Gider Kartı */}
        <BentoCard glowColor="fuchsia" className="h-40 relative overflow-hidden group p-6">

          {/* Ana kapsayıcı*/}
          <div className="relative z-10 flex flex-col mb-10 justify-between h-full">

            {/* İkon ve Başlık  */}
            <div className="flex items-center gap-3 mt-1">
              <div className="p-2.5 rounded-xl bg-linear-to-b from-fuchsia-500/20 to-fuchsia-500/5 border border-fuchsia-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-md group-hover:border-fuchsia-500/40 transition-colors duration-300">
                <TrendingUp size={21} className="text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.6)]" />
              </div>
              <span className="text-[15px] font-bold text-fuchsia-400 uppercase tracking-[0.2em]">En Yüksek</span>
            </div>

            {/* İsim ve Fiyat container */}
            <div className="flex items-end justify-between w-full">

              {/* Netflix Yazısı */}

              <div className="flex flex-col justify-end mb-2">
                <p className="text-2xl font-bold text-white leading-none truncate max-w-37.5">
                  {mostExpensive.name}
                </p>
              </div>

              {/* Fiyat */}

              <p className="text-3xl font-black text-fuchsia-400 tracking-tighter leading-none mr-5">
                {formatCurrency(mostExpensive.price)}
              </p>

            </div>

          </div>
          {/* Arka Plan Süsü */}
          <TrendingUp size={120} className="absolute -right-8 -bottom-8 text-fuchsia-400/35 -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
        </BentoCard>

      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
          Son Abonelikler
        </h2>
        <div className="h-px bg-yellow-400/25 flex-1 ml-6"></div>
      </div>

      {/* Dashboard Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {enhancedSubscriptions.slice(0, 4).map((sub) => (
          <BentoCard key={sub.id} glowColor={sub.glowColor} className="aspect-4/3 group relative overflow-hidden p-5 flex flex-col justify-between">

            {/* Logo ve Kategori */}
            <div className="relative z-20 flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-white/10 to-transparent border border-white/10 p-2.5 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                <img
                  src={sub.image}
                  alt={sub.name}
                  onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Infobox_info_icon.svg" }}
                  className="w-full h-full object-contain filter drop-shadow-md opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>


            </div>

            {/* İsim ve Bilgi */}
            <div className="relative z-20 mt-4">
              <h4 className="text-xl font-black text-white mb-4.5 tracking-tight group-hover:translate-x-1 transition-transform duration-300 truncate">
                {sub.name}
              </h4>
           
            </div>

            {/* Fiyat ve İlerleme  */}
            <div className="relative z-20 space-y-2">

              {/* ödeme döngüsü çizgisi */}
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-transparent to-white/20 w-2/3 rounded-full"
                  style={{ backgroundColor: sub.glowColor }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest leading-none mb-1">Aylık</span>
                  <div className="text-lg font-black text-white flex items-baseline gap-1">
                    {formatCurrency(sub.price).replace("₺", "").replace(",00", "")}
                    <span className="text-sm font-bold text-zinc-100">₺</span>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 group-hover:bg-white/10 transition-all duration-300">
                  <ChevronRight size={16} className="text-white" />
                </div>
              </div>
            </div>

            {/* Arka Plan */}
            <div className="absolute -right-2 -top-2 w-36 h-36 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 pointer-events-none rotate-12">
              <img src={sub.image} alt="" className="w-full h-full object-contain grayscale invert" onError={(e) => e.target.style.display = 'none'} />
            </div>

            {/* Işık Süzmesi  */}
            <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </BentoCard>
        ))}

        {/* Ekle Kartı */}
        <BentoCard
          glowColor="zinc"
          className="aspect-4/3 border-dashed border-zinc-800 bg-transparent hover:bg-zinc-900/30 cursor-pointer flex flex-col items-center justify-center group"
          onClick={() => setActiveTab(TABS.SUBSCRIPTIONS)}
        >
          <div className="w-12 h-12 mb-3 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-600 transition-colors relative z-20">
            <Plus size={24} className="text-zinc-300 group-hover:text-white" />
          </div>
          <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors relative z-20">Yeni Ekle</span>
        </BentoCard>
      </div>
    </div>
  );
};

export default DashboardView;