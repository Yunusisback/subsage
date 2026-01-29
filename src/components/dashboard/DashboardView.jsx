import { useMemo } from 'react';
import BentoCard from "../ui/BentoCard";
import { ArrowUpRight, Zap, ArchiveX, ChevronRight, Wallet, CreditCard, Activity } from "lucide-react";
import { useGlobal } from "../../context/GlobalContext";
import { cn } from "../../utils/helpers";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Para formatlama fonksiyonu
const formatMoneyClean = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const DashboardView = ({ setActiveTab }) => {
    const { totalExpenses, subscriptions } = useGlobal();

    const activeSubs = subscriptions.filter(sub => sub.status === 'active');
    const canceledSubs = subscriptions.filter(sub => sub.status === 'canceled');

    // Grafik verisi hesaplama
    const chartData = useMemo(() => {

        // Tüm tarihleri topla ve sırala
        const allDates = activeSubs
            .map(sub => new Date(sub.startDate))
            .sort((a, b) => a - b);

        if (allDates.length === 0) return [{ value: 0 }];

        // İlk abonelik tarihinden bugüne kadar olan ayları oluştur
        const start = allDates[0];
        const end = new Date();
        const timeline = [];

        let current = new Date(start);

        // Grafiğin boş görünmemesi için başlangıçtan 1 ay öncesini de alabiliriz ama şimdilik direkt başlıyoruz

        while (current <= end) {
            timeline.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }

        // Bugünü de ekle 
        if (timeline.length === 0 || timeline[timeline.length - 1] < end) {
            timeline.push(end);
        }

        // Her tarih için toplam harcamayı hesapla
        const data = timeline.map(date => {
            const subsActiveAtDate = activeSubs.filter(sub => new Date(sub.startDate) <= date);

            const totalValue = subsActiveAtDate.reduce((acc, sub) => acc + parseFloat(sub.price), 0);
            const countValue = subsActiveAtDate.length;

            return {
                date: date.toLocaleDateString('tr-TR', { month: 'short' }),
                value: totalValue,
                count: countValue
            };
        });

        // Eğer tek bir veri varsa (yeni başladıysa) düz çizgi oluşması için kopyala
        if (data.length === 1) {
            return [{ ...data[0], date: 'Başlangıç' }, data[0]];
        }

        return data;
    }, [activeSubs]);

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

    // Renk Temaları 
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
            else progressValue = Math.floor(Math.random() * 70) + 10;

            let themeKey = "dark";
            if (sub.color && THEMES[sub.color]) themeKey = sub.color; // Renk varsa kullan
            else {

                // Yoksa isme göre tahmin et 
                if (n.includes("netflix") || n.includes("youtube") || n.includes("tinder")) themeKey = "red";
                else if (n.includes("spotify") || n.includes("xbox") || n.includes("whatsapp")) themeKey = "green";
                else if (n.includes("prime") || n.includes("amazon")) themeKey = "blue";
                else if (n.includes("disney") || n.includes("playstation")) themeKey = "blue";
                else if (n.includes("icloud") || n.includes("apple")) themeKey = "sky";
                else if (n.includes("exxen") || n.includes("tod")) themeKey = "yellow";
                else if (n.includes("discord")) themeKey = "purple";
            }
            return { ...sub, progress: progressValue, theme: THEMES[themeKey] || THEMES.dark };
        });
    }, [activeSubs]);

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500 pb-20 space-y-8 p-1">

            {/* üst kısım dinamik grafikler  */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* toplam gider kartı*/}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between h-45">
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-red-800 text-2xl font-semibold">Toplam Gider</span>
                                {growthPercentage !== 0 && (
                                    <span className={cn(
                                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                        growthPercentage > 0 ? "bg-orange-100 text-red-600" : "bg-green-100 text-green-600"
                                    )}>
                                        {growthPercentage > 0 ? "+" : ""}{growthPercentage}%
                                    </span>
                                )}
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-black text-red-900 tracking-tighter pt-3">
                                    {formatMoneyClean(totalExpenses)}
                                </span>
                                <span className="text-2xl font-bold text-red-800 ml-1">₺</span>
                            </div>
                        </div>
                        <div className="w-15 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-800">
                            <Wallet size={26} />
                        </div>
                    </div>

                    {/* Alt grafik */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSpendOrange" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EB3389" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#EB3389" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#EB3389"
                                    strokeWidth={4}
                                    fill="url(#colorSpendOrange)"
                                    isAnimationActive={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* aktif abonelik */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between h-45">
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <span className="text-yellow-600 text-2xl font-semibold block mb-1">Aktif Abonelik</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-yellow-600 tracking-tighter pt-3">
                                    {activeSubs.length}
                                </span>
                                <span className="text-m font-semibold text-yellow-900">Servis</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <Activity size={20} />
                        </div>
                    </div>

                    {/* alt grafik */}
                    <div className="absolute bottom-0 left-0 right-0 h-15 flex items-end justify-between gap-3 px-4 pb-0">
                        {chartData.map((item, i) => {

                            // Maksimum değere göre yükseklik hesapla 
                            const maxCount = Math.max(...chartData.map(d => d.count)) || 1;
                            const heightPercent = (item.count / maxCount) * 100;

                            return (
                                <div
                                    key={i}
                                    className="w-full bg-yellow-500 rounded-t-sm opacity-90 transition-all duration-500"
                                    style={{ height: `${heightPercent}%` }}
                                    title={`${item.date}: ${item.count} Abonelik`}
                                ></div>
                            );
                        })}

                        {/* Veri yoksa boş bar göster */}
                        {chartData.length === 0 && <div className="w-full bg-slate-100 h-2 rounded"></div>}
                    </div>
                </div>

                {/* En Yüksek Abonelik */}
                <div className="bg-[#EB3933] rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between h-45 text-white border border-white/10">

                    {/* Arka Plan Efekti  */}
                    <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-[#1a1a1a]/40 to-transparent pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-[20px] font-black text-white uppercase tracking-[0.2em] ">En Yüksek</span>
                        </div>
                        <h3 className="text-2xl font-bold truncate pr-4 text-white drop-shadow-sm p-2">{mostExpensive.name}</h3>
                    </div>

                    <div className="relative z-10 flex items-end justify-between">
                        <div>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-black tracking-tighter text-rose-50 drop-shadow-md pt-3">
                                    {formatMoneyClean(mostExpensive.price)}
                                </span>
                                <span className="text-3xl text-white font-bold ml-1.5 ">₺</span>
                            </div>
                        </div>
                        <div className="group w-11 h-11 rounded-2xl bg-white flex items-center justify-center border border-white/20 hover:bg-red-800 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                            <ArrowUpRight size={20} className="text-red-500  group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>

            </div>

            {/* abonelikler listesi*/}
            <div>
                <div className="flex items-center justify-between mb-6 px-1">
                    <div>
                        <h2 className="text-2xl font-bold text-yellow-800 flex items-center gap-2">
                            Aboneliklerim
                        </h2>

                    </div>
                    <button
                        onClick={() => setActiveTab('subscriptions')}
                        className="text-sm font-semibold text-yellow-900 border border-yellow-900/30 bg-transparent hover:bg-yellow-900/5 hover:border-yellow-900/50 px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                        Tümünü Gör
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {enhancedSubscriptions.map((sub) => (
                        <BentoCard
                            key={sub.id}
                            className={cn(
                                "group relative overflow-hidden p-5 flex flex-col justify-between transition-all duration-300 border shadow-sm hover:shadow-lg hover:-translate-y-1 rounded-[20px] bg-white",
                                sub.theme.border
                            )}
                        >
                            {/* Logo ve İsim */}
                            <div className="flex items-start justify-between w-full mb-4 z-10">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-12 h-12 rounded-xl p-2 flex items-center justify-center shadow-sm border transition-transform group-hover:scale-105 bg-white", sub.theme.border)}>
                                        <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 leading-tight">{sub.name}</h4>
                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", sub.theme.subtext)}>AYLIK PLAN</span>
                                    </div>
                                </div>

                                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                    <ChevronRight size={20} />
                                </button>
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
                            <div className="w-full flex justify-between items-center mt-4 pt-4 border-t border-slate-100 z-10">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                    <CreditCard size={14} />
                                    <span>Otomatik</span>
                                </div>
                                <div className="text-xl font-black text-slate-900 tabular-nums tracking-tight">
                                    {formatMoneyClean(sub.price)} <span className="text-xs font-bold text-slate-500">₺</span>
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
                <div className="mt-12 bg-slate-50/50 border border-slate-200 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-6 opacity-70">
                        <div className="p-2 bg-slate-200 rounded-lg">
                            <ArchiveX size={18} className="text-slate-600" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                            Geçmiş Abonelikler
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {canceledSubs.map((sub) => (
                            <div key={sub.id} className="group flex items-center gap-4 bg-white p-3 pr-5 rounded-2xl border border-slate-100 shadow-sm opacity-60 hover:opacity-100 hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1.5 shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                    <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
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