import { useState, useMemo } from "react";
import { Plus, Calendar, ArrowLeft, CheckCircle2, X, Loader2, Sparkles, Search,  Filter, Trash2, XCircle } from "lucide-react";
import Button from "../ui/Button";
import { useGlobal } from "../../context/GlobalContext";
import { cn } from "../../utils/helpers";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

// Para birimi formatlayıcı 
const formatMoneyClean = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Platform Listesi
const PLATFORMS = [
    { id: "p1", name: "Netflix", category: "Eğlence", price: "199.99", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { id: "p2", name: "Spotify", category: "Müzik", price: "59.99", color: "green", image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
    { id: "p3", name: "YouTube Premium", category: "Video", price: "57.99", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" },
    { id: "p4", name: "Amazon Prime", category: "Alışveriş", price: "39.00", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png" },
    { id: "p5", name: "Disney+", category: "Eğlence", price: "134.99", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
    { id: "p6", name: "Apple One", category: "Paket", price: "194.00", color: "zinc", image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { id: "p7", name: "iCloud+", category: "Bulut", price: "12.99", color: "sky", image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/ICloud_logo.svg" },
    { id: "p8", name: "Exxen", category: "Eğlence", price: "160.90", color: "yellow", image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Exxen_logo.svg" },
    { id: "p9", name: "BluTV", category: "Eğlence", price: "99.90", color: "sky", image: "https://upload.wikimedia.org/wikipedia/commons/1/16/BluTV_Logo.png" },
    { id: "p10", name: "Xbox Game Pass", category: "Oyun", price: "159.00", color: "green", image: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Xbox_Game_Pass_logo.svg" },
    { id: "p11", name: "PlayStation Plus", category: "Oyun", price: "200.00", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_plus_logo.png" },
    { id: "p12", name: "Discord Nitro", category: "Sosyal", price: "104.99", color: "purple", image: "https://assets-global.website-files.com/6257adef93867e56f84d3092/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" },
    { id: "p13", name: "Mubi", category: "Film", price: "129.00", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/2/29/MUBI_logo.svg" },
    { id: "p14", name: "Tod TV", category: "Spor", price: "249.00", color: "purple", image: "https://upload.wikimedia.org/wikipedia/commons/2/20/Tod_logo.svg" },
    { id: "p15", name: "Gain", category: "Eğlence", price: "99.00", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/6/66/Gain_Logo.png" },
    { id: "p16", name: "Adobe CC", category: "Yazılım", price: "582.00", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Creative_Cloud.svg" },
    { id: "p17", name: "Canva Pro", category: "Tasarım", price: "149.00", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg" },
    { id: "p18", name: "ChatGPT Plus", category: "Yapay Zeka", price: "650.00", color: "green", image: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
    { id: "p19", name: "Duolingo", category: "Eğitim", price: "89.99", color: "green", image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Duolingo_icon.svg" },
    { id: "p20", name: "Tinder Gold", category: "Yaşam Tarzı", price: "250.00", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/TinderIcon-2017.svg" },
];

const SubscriptionList = () => {

   
    const { subscriptions, addSubscription, cancelSubscription, removeSubscription } = useGlobal();
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingStates, setLoadingStates] = useState({});

    // liste Filtresi
    const [viewFilter, setViewFilter] = useState("active");

    // Görüntülenecek abonelikleri filtrele
    const displayedSubscriptions = subscriptions.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = viewFilter === "active"
            ? sub.status === "active"
            : sub.status === "canceled";

        return matchesStatus && matchesSearch;
    });

    const activeSubscriptionsCount = subscriptions.filter(sub => sub.status === 'active').length;

    // Arama Filtresi 
    const filteredPlatforms = useMemo(() => {
        return PLATFORMS.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleAddPlatform = (platform) => {

        // Zaten aktifse ekleme
        const isAlreadySubscribed = subscriptions.some(sub => sub.name === platform.name && sub.status === 'active');
        if (isAlreadySubscribed) return;

        setLoadingStates(prev => ({ ...prev, [platform.id]: "loading" }));

        const newSubscription = {
            ...platform,
            id: Date.now(),
            startDate: new Date().toISOString().split("T")[0],
            status: 'active'
        };

        // Simüle edilmiş API isteği
        setTimeout(() => {
            if (addSubscription) addSubscription(newSubscription);
            setLoadingStates(prev => ({ ...prev, [platform.id]: "success" }));
            toast.success(`${platform.name} başarıyla eklendi!`);
            setTimeout(() => {
                setLoadingStates(prev => ({ ...prev, [platform.id]: null }));
            }, 1000);
        }, 800);
    };

    const handleCancel = (e, subId) => {
        e.stopPropagation();
        setLoadingStates(prev => ({ ...prev, [subId]: "canceling" }));

        setTimeout(() => {
            cancelSubscription(subId);
            setLoadingStates(prev => ({ ...prev, [subId]: null }));
            toast.success("Abonelik iptal edildi.");
        }, 1000);
    };

    //  Kalıcı Silme Fonksiyonu
    const handleDelete = (e, subId) => {
        e.stopPropagation();
        if (window.confirm("Bu kaydı geçmişten tamamen silmek istediğine emin misin?")) {
            removeSubscription(subId);
            toast.success("Kayıt silindi.");
        }
    }

    return (
        <div className="pb-20">

            {/* header ve kontroller */}
            <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-8">
                
                <div className="flex items-center gap-3 w-full md:w-auto">

                    {/* Arama Kutusu */}
                    <div className="relative group w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder={isAddingMode ? "Servis ara..." : "Abonelik ara..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-full md:w-64 transition-all"
                        />
                    </div>

                    {/* Ekle -İptal Butonu */}
                    <Button
                        onClick={() => {
                            setIsAddingMode(!isAddingMode);
                            setSearchQuery(""); 
                        }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all cursor-pointer border shadow-sm shrink-0",
                            isAddingMode
                                ? "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                                : "bg-yellow-600 text-white hover:bg-yellow-700 border-transparent shadow-blue-200 -shadow-md"
                        )}
                    >
                        {isAddingMode ? <ArrowLeft size={18} /> : <Plus size={18} />}
                        {isAddingMode ? "Listeye Dön" : " Abonelik Ekle"}
                    </Button>
                </div>
            </div>

            {/* tab menü */}
            {!isAddingMode && (
                <div className="flex gap-2 mb-6 border-b border-slate-200 pb-1">
                    <button
                        onClick={() => setViewFilter("active")}
                        className={cn(
                            "px-4 py-2 text-sm font-bold cursor-pointer rounded-t-lg transition-all relative top-1",
                            viewFilter === "active"
                                ? "text-yellow-600 border-b-2 border-byellow-600 bg-yellow-50/50"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        Aktif Abonelikler
                    </button>
                    <button
                        onClick={() => setViewFilter("canceled")}
                        className={cn(
                            "px-4 py-2 text-sm font-bold rounded-t-lg cursor-pointer transition-all relative top-1",
                            viewFilter === "canceled"
                                ? "text-red-800 border-b-2 border-red-800 bg-red-100"
                                : "text-red-800 hover:text-red-700 hover:bg-red-50"
                        )}
                    >
                        İptal Edilenler
                    </button>
                </div>
            )}

            {/* içerik */}
            <AnimatePresence mode="wait">

                {isAddingMode ? (
                  
                    <motion.div
                        key="add-mode"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    >
                        {filteredPlatforms.map((platform) => {
                            const isSubscribed = subscriptions.some(sub => sub.name === platform.name && sub.status === 'active');
                            const status = loadingStates[platform.id];

                            return (
                                <div
                                    key={platform.id}
                                    className={cn(
                                        "group relative bg-white border rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300",
                                        isSubscribed && status !== "success"
                                            ? "opacity-50 grayscale border-slate-100 bg-slate-50 cursor-default"
                                            : "border-slate-200 hover:border-blue-300 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer"
                                    )}
                                    onClick={() => !isSubscribed && handleAddPlatform(platform)}
                                >
                                    {/* Platform Logo */}
                                    <div className="w-14 h-14 mb-4 rounded-xl bg-white border border-slate-100 p-2.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                                        <img src={platform.image} alt={platform.name} className="w-full h-full object-contain" />
                                    </div>

                                    <h3 className="font-bold text-slate-900 text-sm mb-1">{platform.name}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-100 mb-3">
                                        {platform.category}
                                    </span>

                                    <div className="mt-auto w-full pt-3 border-t border-slate-50 flex flex-col items-center justify-center gap-1">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-black text-slate-800 tracking-tight">{formatMoneyClean(platform.price)}</span>
                                            <span className="text-[10px] font-bold text-slate-400">₺/ay</span>
                                        </div>

                                        {/* State göstergesi */}
                                        <div className="h-6 flex items-center justify-center">
                                            {status === "loading" ? (
                                                <Loader2 size={16} className="animate-spin text-blue-500" />
                                            ) : status === "success" ? (
                                                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 animate-in zoom-in">
                                                    <CheckCircle2 size={12} /> <span className="text-[10px] font-bold">Eklendi</span>
                                                </div>
                                            ) : isSubscribed ? (
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <CheckCircle2 size={12} /> Mevcut
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Seçmek için tıkla
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                   {/* seçili değilken hover ikonu */}
                                    {!isSubscribed && (
                                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                            <Plus size={14} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {filteredPlatforms.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <Filter className="mx-auto h-12 w-12 text-slate-200 mb-2" />
                                <p className="text-slate-500">Aradığınız kriterlere uygun servis bulunamadı.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    
                    <motion.div
                        key="list-mode"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                        {displayedSubscriptions.map((sub) => {
                            const isCanceling = loadingStates[sub.id] === "canceling";
                            const isInactive = sub.status === 'canceled';

                            // Dinamik renk border ı
                            const hoverBorderColor =
                                sub.color === 'red' ? 'group-hover:border-rose-200' :
                                    sub.color === 'green' ? 'group-hover:border-emerald-200' :
                                        sub.color === 'blue' ? 'group-hover:border-blue-200' :
                                            sub.color === 'purple' ? 'group-hover:border-violet-200' :
                                                'group-hover:border-slate-300';

                            return (
                                <div
                                    key={sub.id}
                                    className={cn(
                                        "group relative bg-white p-6 rounded-[28px] border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default overflow-hidden",
                                        isInactive ? "opacity-75 grayscale hover:grayscale-0" : hoverBorderColor
                                    )}
                                >
                                    {/* Logo ve Buton */}
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl border p-2.5 flex items-center justify-center shadow-sm",
                                            isInactive ? "bg-slate-50 border-slate-100" : "bg-white border-slate-100"
                                        )}>
                                            <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                                        </div>

                                        {isInactive ? (
                                            // Silme Butonu
                                            <button
                                                className="w-8 h-8 flex items-center justify-center rounded-full transition-all border bg-slate-50 border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                                                onClick={(e) => handleDelete(e, sub.id)}
                                                title="Geçmişten Sil"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        ) : (
                                            // İptal Butonu 
                                            <button
                                                className={cn(
                                                    "w-8 h-8 flex items-center justify-center rounded-full transition-all border",
                                                    "bg-white border-slate-200 text-slate-400",
                                                    "hover:bg-red-50 hover:text-red-600 hover:border-red-100",
                                                    isCanceling && "opacity-70 cursor-not-allowed"
                                                )}
                                                onClick={(e) => !isCanceling && handleCancel(e, sub.id)}
                                                disabled={isCanceling}
                                                title="Aboneliği İptal Et"
                                            >
                                                {isCanceling ? <Loader2 size={14} className="animate-spin" /> : <X size={16} />}
                                            </button>
                                        )}
                                    </div>

                                    {/* İçerik */}
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={cn("text-lg font-bold tracking-tight", isInactive ? "text-slate-600 line-through decoration-slate-300 decoration-2" : "text-slate-900")}>
                                                {sub.name}
                                            </h3>
                                            <span className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border",
                                                isInactive ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-slate-50 text-slate-500 border-slate-100"
                                            )}>
                                                {sub.category}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-5">
                                            <Calendar size={12} />
                                            <span>
                                                {isInactive ? `İptal: ${sub.canceledDate || 'Bilinmiyor'}` : `Başlangıç: ${sub.startDate}`}
                                            </span>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                                {isInactive ? (
                                                    <span className="flex items-center gap-1 text-slate-400"><XCircle size={14} /> Pasif</span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={14} /> Aktif</span>
                                                )}
                                            </div>
                                            <div className="flex items-baseline gap-0.5">
                                                <span className={cn("text-2xl font-black tracking-tighter tabular-nums", isInactive ? "text-slate-400" : "text-slate-900")}>
                                                    {formatMoneyClean(sub.price)}
                                                </span>
                                                <span className="text-sm font-bold text-slate-400">₺</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* empty state */}
                        {displayedSubscriptions.length === 0 && (
                            <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                                <Sparkles className="mx-auto h-12 w-12 text-slate-300 mb-4 animate-pulse" />
                                <h3 className="text-slate-900 font-bold text-lg">
                                    {viewFilter === 'active' ? 'Aktif abonelik bulunamadı' : 'Geçmiş abonelik bulunamadı'}
                                </h3>
                                <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                                    {viewFilter === 'active'
                                        ? "Giderlerinizi takip etmeye başlamak için ilk aboneliğinizi ekleyin."
                                        : "İptal ettiğiniz abonelikler burada listelenir."}
                                </p>
                                {viewFilter === 'active' && (
                                    <Button
                                        className="bg-slate-900 text-white hover:bg-black px-6 py-3 rounded-xl shadow-lg shadow-slate-200"
                                        onClick={() => setIsAddingMode(true)}
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Hemen Ekle
                                    </Button>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubscriptionList;