import { useMemo } from 'react';
import BentoCard from "../ui/BentoCard";
import {  ArchiveX, ChevronRight, Wallet, CreditCard, CalendarClock, TrendingDown, Layers,  TrendingUp } from "lucide-react";
import { useGlobal } from "../../context/GlobalContext";
import { cn } from "../../utils/helpers";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { SERVICE_LOGOS } from "../../utils/constants"; 
import { useNavigate } from "react-router-dom"; 

// Para formatlama fonksiyonu
const formatMoneyClean = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const DashboardView = () => { 
    const { totalExpenses, subscriptions } = useGlobal();
    const navigate = useNavigate(); 

    const activeSubs = subscriptions.filter(sub => sub.status === 'active');
    const canceledSubs = subscriptions.filter(sub => sub.status === 'canceled');

    // Grafik verisi hesaplama
    const chartData = useMemo(() => {
       
        const allDates = subscriptions
            .map(sub => new Date(sub.startDate))
            .filter(date => !isNaN(date))
            .sort((a, b) => a - b);

        if (allDates.length === 0) return [{ value: 0 }];

        const start = allDates[0];
        const end = new Date();
        const timeline = [];
        let current = new Date(start);

   
        while (current <= end) {
            timeline.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }
       
        if (timeline.length === 0 || timeline[timeline.length - 1] < end) {
            timeline.push(end);
        }

        const data = timeline.map(date => {
        
            const subsActiveAtDate = subscriptions.filter(sub => {
                const startDate = new Date(sub.startDate);
                
                
                let cancelDateObj = null;
                if (sub.status === 'canceled' && sub.canceledDate) {
                     const parts = sub.canceledDate.split('.');
                     if (parts.length === 3) {
                         cancelDateObj = new Date(parts[2], parts[1] - 1, parts[0]);
                     }
                }

                const isStarted = startDate <= date;
               
                const isStillActiveAtThisDate = !cancelDateObj || cancelDateObj > date;

                return isStarted && isStillActiveAtThisDate;
            });

            const totalValue = subsActiveAtDate.reduce((acc, sub) => acc + parseFloat(sub.price), 0);
            return {
                date: date.toLocaleDateString('tr-TR', { month: 'short' }),
                value: totalValue,
                count: subsActiveAtDate.length
            };
        });

        if (data.length === 1) return [{ ...data[0], date: 'Başlangıç' }, data[0]];
        return data;
    }, [subscriptions]); 

    // Son ayın değişim oranı 
    const growthPercentage = useMemo(() => {
        if (chartData.length < 2) return 0;
        const last = chartData[chartData.length - 1].value;
        const prev = chartData[chartData.length - 2].value;
        if (prev === 0) return 100;
        return Math.round(((last - prev) / prev) * 100);
    }, [chartData]);


    // En pahalıyı bul
    const mostExpensive = useMemo(() => {
        if (activeSubs.length === 0) return { name: '-', price: 0 };
        return activeSubs.reduce((prev, current) => {
            return (parseFloat(prev.price) > parseFloat(current.price)) ? prev : current;
        }, activeSubs[0]);
    }, [activeSubs]);

    // Yıllık Projeksiyon Hesabı
    const yearlyProjection = totalExpenses * 12;
    const yearlySavingsTip = mostExpensive.price > 0 
        ? `${mostExpensive.name} iptal edilirse yılda ${formatMoneyClean(mostExpensive.price * 12)}₺ cepte.`
        : "Abonelik ekleyerek tasarruf analizlerini görebilirsin.";


   
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
            let progressValue = 50;
            const n = sub.name.toLowerCase();
            if (n.includes("netflix")) progressValue = 85;
            else if (n.includes("spotify")) progressValue = 20;
            else {
                const uniqueNumber = typeof sub.id === 'number' ? sub.id : sub.name.length;
                progressValue = ((uniqueNumber * 7) % 80) + 10; 
            }

            let themeKey = "dark";
            if (sub.color && THEMES[sub.color]) themeKey = sub.color; 
            else {
                if (n.includes("netflix") || n.includes("youtube") || n.includes("tinder")) themeKey = "red";
                else if (n.includes("spotify") || n.includes("xbox") || n.includes("whatsapp")) themeKey = "green";
                else if (n.includes("prime") || n.includes("amazon") || n.includes("disney") || n.includes("playstation")) themeKey = "blue";
                else if (n.includes("icloud") || n.includes("apple")) themeKey = "sky";
                else if (n.includes("exxen") || n.includes("tod")) themeKey = "yellow";
                else if (n.includes("discord")) themeKey = "purple";
            }
            return { ...sub, progress: progressValue, theme: THEMES[themeKey] || THEMES.dark };
        });
    }, [activeSubs]);

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500 pb-20 space-y-8 p-1">

            {/* üst kısım dinamik grafikler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* aktif servisler */}
                <div className="relative group bg-white rounded-4xl p-6 border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.20)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-48 overflow-hidden">

                    {/* Arkaplan */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] transition-all group-hover:scale-110 z-0"></div>
                    
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-indigo-600  font-bold text-xm tracking-wide mb-2">AKTİF SERVİSLER</h3>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-5xl font-black text-indigo-800 tracking-tighter">
                                        {activeSubs.length}
                                    </span>
                                    <span className="text-lg font-semibold text-slate-500">adet</span>
                                </div>
                            </div>
                            <div className="p-3 bg-indigo-100/50 text-indigo-600 rounded-2xl shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                <Layers size={22} strokeWidth={2} />
                            </div>
                        </div>

                        {/* Avatarlar */}
                        <div className="mt-4">
                            <div className="flex items-center">
                                {activeSubs.slice(0, 5).map((sub, i) => (
                                    <div key={i} 
                                        className="w-11 h-11 rounded-full border-[3px] border-white bg-white shadow-sm -ml-3 first:ml-0 relative z-0 hover:z-10 hover:scale-110 transition-transform cursor-pointer"
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
                                    <div className="w-11 h-11 rounded-full border-[3px] border-white bg-indigo-50 -ml-3 z-0 flex items-center justify-center text-xs font-bold text-indigo-600">
                                        +{activeSubs.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* yıllık projeksiyon */}
                <div className="relative group bg-white rounded-4xl p-6 border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.20)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-48 overflow-hidden">

                     {/* Arkaplan */}
                     <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-50/80 rounded-full blur-2xl group-hover:bg-emerald-100/50 transition-colors"></div>
                    
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-green-600 font-bold text-Xm tracking-wide mb-2 flex items-center gap-1">
                                    YILLIK PROJEKSİYON 
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl lg:text-5xl font-black text-green-800 tracking-tighter">
                                        {formatMoneyClean(yearlyProjection)}
                                    </span>
                                    <span className="text-xl font-bold text-emerald-500">₺</span>
                                </div>
                            </div>
                            <div className="p-3 bg-emerald-100/50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                <CalendarClock size={22} strokeWidth={2} />
                            </div>
                        </div>

                        {/* Tasarruf İpucu */}
                        <div className="mt-auto bg-emerald-50/80 border border-emerald-100/50 rounded-xl p-3 flex items-start gap-3 backdrop-blur-sm">
                            <div className="mt-0.5 p-1 bg-white rounded-full text-emerald-600 shrink-0 shadow-xs">
                                <TrendingDown size={12} strokeWidth={3} />
                            </div>
                            <p className="text-xs font-semibold text-emerald-800 leading-relaxed line-clamp-2">
                                {yearlySavingsTip}
                            </p>
                        </div>
                    </div>
                </div>

                {/* aylık toplam */}
                <div className="relative group bg-white rounded-4xl border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.20)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-48 overflow-hidden flex flex-col">
                    
                    <div className="p-6 pb-0 relative z-20 flex justify-between items-start">
                        <div>
                            <h3 className="text-red-600 font-bold text-xm tracking-wide mb-2"> AYLIK TOPLAM</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl lg:text-5xl font-black text-red-800 tracking-tighter">
                                    {formatMoneyClean(totalExpenses)}
                                </span>
                                <span className="text-xl font-bold text-red-500">₺</span>
                            </div>
                            
                            {/* Büyüme Oranı Rozeti */}
                            {growthPercentage !== 0 && (
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs font-bold border",
                                    growthPercentage > 0 
                                        ? "bg-red-50 text-red-600 border-red-100" 
                                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                )}>
                                    {growthPercentage > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    <span>{Math.abs(growthPercentage)}%</span>
                                    <span className="font-medium opacity-70 ml-0.5">{growthPercentage > 0 ? "artış" : "düşüş"}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-red-100/50 text-red-600 rounded-2xl shadow-sm border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                            <Wallet size={22} strokeWidth={2} />
                        </div>
                    </div>

                    {/* Grafik */}
                    <div className="absolute -bottom-2  left-2 right-0 h-25 w-full z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C23115" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#C23115" stopOpacity={0.5} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone" 
                                    dataKey="value"
                                    stroke="#C23115"
                                    strokeWidth={4}
                                    fill="url(#colorSpend)"
                                    fillOpacity={1}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* abonelikler listesi*/}
            <div>
                <div className="flex items-center justify-between mb-4 lg:mb-6 px-1">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-cyan-700 flex items-center gap-2">
                            Aboneliklerim
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/subscriptions')} 
                        className="text-xs lg:text-sm font-semibold text-zinc-600 border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                    >
                        Tümünü Gör <ChevronRight size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                    {enhancedSubscriptions.map((sub) => (
                        <BentoCard
                            key={sub.id}
                            className={cn(
                                "group relative overflow-hidden p-5 flex flex-col justify-between transition-all duration-300 border shadow-sm hover:shadow-lg hover:-translate-y-1 rounded-3xl bg-white",
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
                                    <span className={cn("text-xs font-bold", sub.theme.subtext)}>{sub.progress}% kaldı</span>
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
                                    {formatMoneyClean(sub.price)} <span className="text-xl font-bold text-slate-600">₺</span>
                                </div>
                            </div>

                            {/* arka plan glow */}
                            <div className={cn("absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[60px] opacity-20 pointer-events-none", sub.theme.bar)}></div>
                        </BentoCard>
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