import { useMemo } from 'react';
import { ArchiveX, ChevronRight, Wallet, CalendarClock, TrendingDown, Layers, TrendingUp } from "lucide-react";
import { useData } from "../../context/DataContext";
import { useSpendingAnalysis } from "../../hooks/useSpendingAnalysis";
import { cn } from "../../utils/helpers";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { SERVICE_LOGOS } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import SubscriptionCard from "./SubscriptionCard";
import StatCard from "./StatCard";

// Para formatlama fonksiyonu
const formatMoneyClean = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Kalan gün hesaplama fonksiyonu
const calculateDaysLeft = (startDateStr) => {
    if (!startDateStr) return 30; 

    const today = new Date();
    const start = new Date(startDateStr);
    const billingDay = start.getDate(); 

   
    let nextBilling = new Date(today.getFullYear(), today.getMonth(), billingDay);

    // Eğer bu ayın fatura günü geçtiyse bir sonraki aya geç
    if (nextBilling < today) {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
    }

    
    const diffTime = Math.abs(nextBilling - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

const DashboardView = () => {
   
    const { totalExpenses, subscriptions } = useData();
    const navigate = useNavigate();

   
    const {
        activeSubs,
        canceledSubs,
        chartData,
        growthPercentage,
        yearlyProjection,
        yearlySavingsTip
    } = useSpendingAnalysis(subscriptions, totalExpenses);

    const THEMES = {
        red: { bg: "bg-rose-50/50 hover:bg-rose-50", border: "border-rose-100 hover:border-rose-200", text: "text-rose-950", subtext: "text-rose-600", bar: "bg-rose-500", gradient: "from-rose-500 to-pink-600", iconBg: "bg-rose-100 text-rose-600" },
        green: { bg: "bg-emerald-50/50 hover:bg-emerald-50", border: "border-emerald-100 hover:border-emerald-200", text: "text-emerald-950", subtext: "text-emerald-600", bar: "bg-emerald-500", gradient: "from-emerald-500 to-teal-600", iconBg: "bg-emerald-100 text-emerald-600" },
        blue: { bg: "bg-blue-50/50 hover:bg-blue-50", border: "border-blue-100 hover:border-blue-200", text: "text-blue-950", subtext: "text-blue-600", bar: "bg-blue-500", gradient: "from-blue-500 to-indigo-600", iconBg: "bg-blue-100 text-blue-600" },
        purple: { bg: "bg-violet-50/50 hover:bg-violet-50", border: "border-violet-100 hover:border-violet-200", text: "text-violet-950", subtext: "text-violet-600", bar: "bg-violet-500", gradient: "from-violet-500 to-purple-600", iconBg: "bg-violet-100 text-violet-600" },
        yellow: { bg: "bg-amber-50/50 hover:bg-amber-50", border: "border-amber-100 hover:border-amber-200", text: "text-amber-950", subtext: "text-amber-600", bar: "bg-amber-500", gradient: "from-amber-400 to-orange-500", iconBg: "bg-amber-100 text-amber-700" },
        dark: { bg: "bg-slate-50/50 hover:bg-slate-100", border: "border-slate-200 hover:border-slate-300", text: "text-slate-900", subtext: "text-slate-500", bar: "bg-slate-800", gradient: "from-slate-700 to-black", iconBg: "bg-white text-black border border-slate-200" },
        sky: { bg: "bg-sky-50/50 hover:bg-sky-50", border: "border-sky-100 hover:border-sky-200", text: "text-sky-950", subtext: "text-sky-600", bar: "bg-sky-500", gradient: "from-sky-400 to-cyan-500", iconBg: "bg-sky-100 text-sky-600" }
    };

    const enhancedSubscriptions = useMemo(() => {
        return activeSubs.map(sub => {

            
            const daysLeft = calculateDaysLeft(sub.startDate);

            
            const progressValue = Math.min(100, Math.max(0, (daysLeft / 30) * 100));

            let themeKey = "dark";
            const n = sub.name.toLowerCase();

            if (sub.color && THEMES[sub.color]) themeKey = sub.color;
            else {
                if (n.includes("netflix") || n.includes("youtube") || n.includes("tinder")) themeKey = "red";
                else if (n.includes("spotify") || n.includes("xbox") || n.includes("whatsapp")) themeKey = "green";
                else if (n.includes("prime") || n.includes("amazon") || n.includes("disney") || n.includes("playstation")) themeKey = "blue";
                else if (n.includes("icloud") || n.includes("apple")) themeKey = "sky";
                else if (n.includes("exxen") || n.includes("tod")) themeKey = "yellow";
                else if (n.includes("discord")) themeKey = "purple";
            }

            return {
                ...sub,
                daysLeft: daysLeft, 
                progress: progressValue,
                theme: THEMES[themeKey] || THEMES.dark
            };
        });
    }, [activeSubs]);

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500 pb-20 space-y-8 p-1">

            {/* üst kısım dinamik grafikler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">

                {/* aktif servisler  */}
                <StatCard className="bg-linear-to-br from-indigo-500 to-purple-600 border-none text-white shadow-lg shadow-indigo-500/30">

                    {/* Arkaplan */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[4rem] transition-all group-hover:scale-110 z-0"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-white font-bold text-xm tracking-wide mb-2">AKTİF SERVİSLER</h3>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-5xl font-black text-white tracking-tighter">
                                        {activeSubs.length}
                                    </span>
                                    <span className="text-lg font-semibold text-indigo-200">adet</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/20 text-white rounded-2xl shadow-sm border border-white/10 group-hover:bg-white group-hover:text-indigo-600 transition-colors duration-300">
                                <Layers size={22} strokeWidth={2} />
                            </div>
                        </div>

                        {/* Avatarlar */}
                        <div className="mt-4">
                            <div className="flex items-center">
                                {activeSubs.slice(0, 5).map((sub, i) => (
                                    <div key={i}
                                        className="w-11 h-11 rounded-full   bg-white shadow-sm -ml-3 first:ml-0 relative z-0 hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                                        style={{ zIndex: 10 - i }}
                                    >
                                        <img
                                            src={sub.image || SERVICE_LOGOS.DEFAULT}
                                            alt={sub.name}
                                            className="w-full h-full object-cover rounded-full"
                                            onError={(e) => e.target.src = SERVICE_LOGOS.DEFAULT}
                                        />
                                    </div>
                                ))}
                                {activeSubs.length > 5 && (
                                    <div className="w-11 h-11 rounded-full border-[3px] border-indigo-500 bg-indigo-800 -ml-3 z-0 flex items-center justify-center text-xs font-bold text-white">
                                        +{activeSubs.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </StatCard>

                {/* yıllık tahmini gider  */}
                <StatCard className="bg-linear-to-br from-emerald-400 to-teal-500 border-none text-white shadow-lg shadow-emerald-500/30">

                    {/* Arkaplan */}
                    <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-white font-bold text-Xm tracking-wide mb-2 flex items-center gap-1">
                                    YILLIK TAHMİNİ GİDER
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                                        {formatMoneyClean(yearlyProjection)}
                                    </span>
                                    <span className="text-xl font-bold text-emerald-200">₺</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/20 text-white rounded-2xl shadow-sm border border-white/10 group-hover:bg-white group-hover:text-emerald-600 transition-colors duration-300">
                                <CalendarClock size={22} strokeWidth={2} />
                            </div>
                        </div>

                        {/* Tasarruf İpucu */}
                        <div className="mt-auto bg-black/10 border border-white/10 rounded-xl p-3 flex items-start gap-3 backdrop-blur-sm">
                            <div className="mt-0.5 p-1 bg-white rounded-full text-emerald-600 shrink-0 shadow-xs">
                                <TrendingDown size={12} strokeWidth={3} />
                            </div>
                            <p className="text-xs font-semibold text-emerald-50 leading-relaxed line-clamp-2">
                                {yearlySavingsTip}
                            </p>
                        </div>
                    </div>
                </StatCard>

                {/* aylık toplam */}
               
                <StatCard className="flex flex-col p-0 bg-linear-to-br from-rose-500 to-pink-600 border-none text-white shadow-lg shadow-rose-500/30">
                    <div className="p-6 pb-0 relative z-20 flex justify-between items-start">
                        <div>
                            <h3 className="text-white font-bold text-xm tracking-wide mb-2"> AYLIK TOPLAM</h3>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                                        {formatMoneyClean(totalExpenses)}
                                    </span>
                                    <span className="text-xl font-bold text-rose-200">₺</span>
                                </div>

                                {/* büyüme yüzdesi */}
                                {growthPercentage !== 0 && (
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                                        growthPercentage > 0
                                            ? "bg-white/20 text-white border-white/20"
                                            : "bg-gray-100 text-green-600 border-green-200"
                                    )}>
                                        {growthPercentage > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        <span>{Math.abs(growthPercentage)}%</span>
                                        <span className="font-medium opacity-70 ml-0.5">{growthPercentage > 0 ? "artış" : "düşüş"}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-3 bg-white/20 text-white rounded-2xl shadow-sm border border-white/10 group-hover:bg-white group-hover:text-rose-600 transition-colors duration-300">
                            <Wallet size={22} strokeWidth={2} />
                        </div>
                    </div>

                    {/* Grafik */}
                    <div className="absolute -bottom-2 left-0 right-0 h-25 w-full z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSpendWhite" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ffffff" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="linear"
                                    dataKey="displayValue"
                                    stroke="#ffffff"
                                    strokeWidth={3}
                                    fill="url(#colorSpendWhite)"
                                    fillOpacity={1}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </StatCard>

            </div>

            {/* abonelikler listesi*/}
            <div>
                <div className="flex items-center justify-between mb-4 lg:mb-6 px-1">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-cyan-700 flex items-center gap-2 select-none">
                            Aboneliklerim
                        </h2>
                    </div>
                    <button onClick={() => navigate('/subscriptions')} className="text-xs lg:text-sm font-semibold text-white border border-zinc-200 bg-cyan-600 hover:bg-cyan-500 hover:border-cyan-300 px-4 py-2 rounded-3xl shadow-sm transition-all cursor-pointer flex items-center gap-1 scale-95 hover:scale-100 active:scale-95 select-none" > Tümünü Gör <ChevronRight size={14} /> </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                    {enhancedSubscriptions.map((sub) => (
                        <SubscriptionCard 
                            key={sub.id} 
                            sub={sub} 
                            formatMoney={formatMoneyClean} 
                        />
                    ))}
                </div>
            </div>

            {/* İptal Edilenler */}
            {canceledSubs.length > 0 && (
                <div className="mt-8 lg:mt-12 bg-slate-50/50 border border-slate-200 rounded-3xl p-4 lg:p-6">
                    <div className="flex items-center gap-3 mb-6 opacity-70">
                        <div className="p-2 bg-slate-200 rounded-lg">
                            <ArchiveX size={18} className="text-slate-600" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                            Geçmiş Abonelikler
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                        {canceledSubs.map((sub) => (
                            <div key={sub.id} className="group flex items-center gap-4 bg-white p-3 pr-5 rounded-2xl border border-slate-100 shadow-sm opacity-60 hover:opacity-100 hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1.5 shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                    <img
                                        src={sub.image || SERVICE_LOGOS.DEFAULT}
                                        alt={sub.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.src = SERVICE_LOGOS.DEFAULT;
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-700 truncate decoration-slate-400 line-through decoration-2 group-hover:no-underline transition-all">{sub.name}</h4>
                                    <span className="text-[10px] text-slate-400">İptal Edildi</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600">{formatMoneyClean(sub.price)}₺</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default DashboardView;