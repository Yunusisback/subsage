import { useState, useMemo } from "react";
import { Plus, Calendar, ArrowLeft, CheckCircle2, X, Loader2, Search, Filter, Trash2, XCircle, PenTool, Pencil, AlertTriangle } from "lucide-react";
import Button from "../ui/Button";
import { cn, formatDate, formatMoneyClean } from "../../utils/helpers";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { SERVICE_LOGOS, PLATFORMS } from "../../utils/constants";
import AddSubscriptionForm from "./AddSubscriptionForm";
import Modal from "../ui/Modal";
import { useData } from "../../context/DataContext";

const SubscriptionList = () => {

    const { subscriptions, addSubscription, cancelSubscription, removeSubscription } = useData();
    const [isAddingMode, setIsAddingMode] = useState(false);

    const [showCustomForm, setShowCustomForm] = useState(false);

    const [editingSub, setEditingSub] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [loadingStates, setLoadingStates] = useState({});

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

    // platform listesini arama sorgusuna göre filtrele
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

        }, 1000);
    };


    const handleDeleteClick = (e, subId) => {
        e.stopPropagation();
        setDeletingId(subId);
    }


    const confirmDelete = () => {
        if (deletingId) {
            removeSubscription(deletingId);
            toast.success("Kayıt kalıcı olarak silindi.");
            setDeletingId(null);
        }
    };


    const handleCustomSuccess = () => {
        setShowCustomForm(false);
        setIsAddingMode(false);
        toast.success("Özel abonelik başarıyla oluşturuldu!");
    };


    const handleEditClick = (e, sub) => {
        e.stopPropagation();
        setEditingSub(sub);
    };

    const handleEditSuccess = () => {
        setEditingSub(null);
    };

    return (
        <div className="pb-20">

            {/* header ve kontroller */}
            <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-8">

                <div className="flex items-center gap-3 w-full md:w-auto">

                    {/* Arama Kutusu */}
                    {!showCustomForm && (
                        <div className="relative group w-full md:w-auto">

                            <Search
                                className={cn(
                                    "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
                                    "text-zinc-400 dark:text-zinc-500",
                                    "group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400"
                                )}
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder={isAddingMode ? "Servis ara..." : "Abonelik ara..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "pl-10 pr-4 py-2.5 w-full md:w-64 rounded-3xl text-sm outline-none transition-all duration-200",
                                    "bg-white dark:bg-zinc-800/80",
                                    "text-zinc-700 dark:text-zinc-200",
                                    "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                                    "ring-2 ring-zinc-200 dark:ring-zinc-700/80",
                                    "hover:ring-cyan-300 dark:hover:ring-cyan-700",
                                    "focus:ring-cyan-400 dark:focus:ring-cyan-600",
                                    "focus:bg-cyan-50/40 dark:focus:bg-cyan-900/15",
                                    "focus:text-cyan-950 dark:focus:text-cyan-200"
                                )}
                            />
                        </div>
                    )}

                    {/* Ekle - İptal Butonu */}
                    <Button
                        onClick={() => {
                            if (showCustomForm) {
                                setShowCustomForm(false);
                            } else {
                                setIsAddingMode(!isAddingMode);
                                setSearchQuery("");
                            }
                        }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-3xl font-semibold transition-all cursor-pointer border shadow-sm shrink-0",
                            "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600",
                            "text-white border-transparent",
                            "shadow-cyan-200/60 dark:shadow-cyan-900/30"
                        )}
                    >
                        {(isAddingMode || showCustomForm) ? <ArrowLeft size={18} /> : <Plus size={18} />}
                        {(isAddingMode || showCustomForm) ? "Listeye Dön" : " Abonelik Ekle"}
                    </Button>
                </div>
            </div>

            {/* tab menü */}
            {!isAddingMode && !showCustomForm && (
                <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-700/80 pb-1">
                    <button
                        onClick={() => setViewFilter("active")}
                        className={cn(
                            "px-4 py-2 text-sm font-bold cursor-pointer rounded-t-lg transition-all relative top-1",
                            viewFilter === "active"
                                ? "text-cyan-700 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-500 bg-cyan-50 dark:bg-cyan-900/25"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-cyan-700 dark:hover:text-cyan-400 hover:bg-cyan-50/60 dark:hover:bg-cyan-900/15"
                        )}
                    >
                        Aktif Abonelikler
                    </button>
                    <button
                        onClick={() => setViewFilter("canceled")}
                        className={cn(
                            "px-4 py-2 text-sm font-bold rounded-t-lg cursor-pointer transition-all relative top-1",
                            viewFilter === "canceled"
                                ? "text-red-700 dark:text-red-400 border-b-2 border-red-700 dark:border-red-500 bg-red-50 dark:bg-red-900/25"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/15"
                        )}
                    >
                        İptal Edilenler
                    </button>
                </div>
            )}

            {/* içerik */}
            <AnimatePresence mode="wait">

                {isAddingMode ? (

                    showCustomForm ? (
                        <motion.div
                            key="custom-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "max-w-xl mx-auto p-8 -mt-10 rounded-3xl border shadow-lg",
                                "bg-white dark:bg-zinc-900/80",
                                "border-zinc-200 dark:border-zinc-700/80"
                            )}
                        >
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-cyan-200/60 dark:border-cyan-700/40">
                                    <PenTool size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Özel Abonelik Oluştur</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Listede olmayan servisi kendin ekle.</p>
                            </div>
                            <AddSubscriptionForm onSuccess={handleCustomSuccess} />
                        </motion.div>
                    ) : (
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
                                            "group relative border rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300",
                                            "bg-white dark:bg-zinc-900/70",
                                            isSubscribed && status !== "success"
                                                ? "opacity-50 grayscale border-zinc-100 dark:border-zinc-800 cursor-default"
                                                : cn(
                                                    "border-zinc-200 dark:border-zinc-700/80 cursor-pointer",
                                                    "hover:border-cyan-300 dark:hover:border-cyan-700",
                                                    "hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.4)]",
                                                    "hover:-translate-y-1"
                                                )
                                        )}
                                        onClick={() => !isSubscribed && handleAddPlatform(platform)}
                                    >
                                        {/* Platform Logo */}
                                        <div className={cn(
                                            "w-14 h-14 mb-4 rounded-xl border p-2.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300",
                                            "bg-white dark:bg-zinc-800",
                                            "border-zinc-100 dark:border-zinc-700"
                                        )}>
                                            <img
                                                src={platform.image}
                                                alt={platform.name}
                                                className="w-full h-full object-contain"
                                                loading="lazy"
                                                onError={(e) => {
                                                    // Eğer resim yüklenmezse varsayılan göster
                                                    e.target.src = SERVICE_LOGOS.DEFAULT;
                                                }}
                                            />
                                        </div>

                                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">{platform.name}</h3>
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mb-3",
                                            "text-zinc-400 dark:text-zinc-500",
                                            "bg-zinc-50 dark:bg-zinc-800",
                                            "border-zinc-100 dark:border-zinc-700"
                                        )}>
                                            {platform.category}
                                        </span>

                                        <div className="mt-auto w-full pt-3 border-t border-zinc-100 dark:border-zinc-700/80 flex flex-col items-center justify-center gap-1">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-black text-zinc-800 dark:text-zinc-100 tracking-tight">{formatMoneyClean(platform.price)}</span>
                                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">₺/ay</span>
                                            </div>

                                            {/* durum göstergesi */}
                                            <div className="h-6 flex items-center justify-center">
                                                {status === "loading" ? (
                                                    <Loader2 size={16} className="animate-spin text-cyan-500" />
                                                ) : status === "success" ? (
                                                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/50 animate-in zoom-in">
                                                        <CheckCircle2 size={12} /> <span className="text-[10px] font-bold">Eklendi</span>
                                                    </div>
                                                ) : isSubscribed ? (
                                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                                                        <CheckCircle2 size={12} /> Mevcut
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Seçmek için tıkla
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* seçili değilken hover ikonu */}
                                        {!isSubscribed && (
                                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 border border-cyan-100 dark:border-cyan-800/40">
                                                <Plus size={14} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* oluşturma kartı */}
                            <div
                                className={cn(
                                    "group relative border border-dashed rounded-3xl p-5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer",
                                    "bg-white dark:bg-zinc-900/70",
                                    "border-zinc-300 dark:border-zinc-700",
                                    "hover:border-cyan-400 dark:hover:border-cyan-600",
                                    "hover:bg-cyan-50/50 dark:hover:bg-cyan-900/15"
                                )}
                                onClick={() => setShowCustomForm(true)}
                            >
                                <div className={cn(
                                    "w-14 h-14 mb-4 rounded-xl border p-2.5 flex items-center justify-center shadow-sm transition-all duration-300",
                                    "bg-zinc-50 dark:bg-zinc-800",
                                    "border-zinc-100 dark:border-zinc-700",
                                    "text-zinc-400 dark:text-zinc-500",
                                    "group-hover:scale-105 group-hover:bg-white dark:group-hover:bg-zinc-700",
                                    "group-hover:text-cyan-500 dark:group-hover:text-cyan-400"
                                )}>
                                    <Plus size={24} />
                                </div>
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Özel Oluştur</h3>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mb-3",
                                    "text-zinc-400 dark:text-zinc-500",
                                    "bg-zinc-50 dark:bg-zinc-800",
                                    "border-zinc-100 dark:border-zinc-700"
                                )}>
                                    Kişisel
                                </span>
                                <div className="mt-auto w-full pt-3 border-t border-zinc-100 dark:border-zinc-700/80 flex flex-col items-center justify-center gap-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-black text-zinc-300 dark:text-zinc-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">-</span>
                                    </div>
                                    <div className="h-6 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                            Formu Aç
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {filteredPlatforms.length === 0 && (
                                <div className="col-span-full py-20 text-center">
                                    <Filter className="mx-auto h-12 w-12 text-zinc-200 dark:text-zinc-700 mb-2" />
                                    <p className="text-zinc-500 dark:text-zinc-400">Aradığınız kriterlere uygun servis bulunamadı.</p>
                                </div>
                            )}
                        </motion.div>
                    )
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

                            // Dinamik renk border
                            const hoverBorderColor =
                                sub.color === 'red' ? 'group-hover:border-rose-200 dark:group-hover:border-rose-800/50' :
                                    sub.color === 'green' ? 'group-hover:border-emerald-200 dark:group-hover:border-emerald-800/50' :
                                        sub.color === 'blue' ? 'group-hover:border-blue-200 dark:group-hover:border-blue-800/50' :
                                            sub.color === 'purple' ? 'group-hover:border-violet-200 dark:group-hover:border-violet-800/50' :
                                                'group-hover:border-zinc-300 dark:group-hover:border-zinc-600';

                            return (
                                <div
                                    key={sub.id}
                                    className={cn(
                                        "group relative p-6 rounded-[28px] border transition-all duration-300 cursor-default overflow-hidden",
                                        "bg-white dark:bg-zinc-900/70",
                                        "border-zinc-200 dark:border-zinc-700/80",
                                        "shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.3)]",
                                        "hover:shadow-xl dark:hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]",
                                        "hover:-translate-y-1",
                                        isInactive ? "opacity-70 grayscale hover:grayscale-0 hover:opacity-100" : hoverBorderColor
                                    )}
                                >
                                    {/* Logo ve Buton */}
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl border p-2.5 flex items-center justify-center shadow-sm",
                                            "bg-white dark:bg-zinc-800",
                                            "border-zinc-100 dark:border-zinc-700"
                                        )}>
                                            <img
                                                src={sub.image}
                                                alt={sub.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.src = SERVICE_LOGOS.DEFAULT;
                                                }}
                                            />
                                        </div>

                                        <div className="flex gap-2">

                                            {!isInactive && (
                                                <button
                                                    className={cn(
                                                        "w-8 h-8 flex cursor-pointer items-center justify-center rounded-full transition-all border",
                                                        "bg-emerald-500 border-emerald-500 text-white",
                                                        "hover:bg-emerald-600 dark:hover:bg-emerald-700 hover:scale-110"
                                                    )}
                                                    onClick={(e) => handleEditClick(e, sub)}
                                                    title="Düzenle"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                            )}

                                            {isInactive ? (
                                                // Silme Butonu
                                                <button
                                                    className={cn(
                                                        "w-8 h-8 flex items-center justify-center rounded-full transition-all border cursor-pointer",
                                                        "bg-zinc-50 dark:bg-zinc-800",
                                                        "border-zinc-200 dark:border-zinc-700",
                                                        "text-zinc-400 dark:text-zinc-500",
                                                        "hover:bg-red-50 dark:hover:bg-red-900/25",
                                                        "hover:text-red-600 dark:hover:text-red-400",
                                                        "hover:border-red-100 dark:hover:border-red-800/50"
                                                    )}
                                                    onClick={(e) => handleDeleteClick(e, sub.id)}
                                                    title="Geçmişten Sil"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            ) : (
                                                // İptal Butonu
                                                <button
                                                    className={cn(
                                                        "w-8 h-8 flex cursor-pointer items-center justify-center rounded-full transition-all border",
                                                        "bg-red-600 border-red-600 text-white",
                                                        "hover:bg-red-700 dark:hover:bg-red-800 hover:scale-110",
                                                        isCanceling && "opacity-60 cursor-not-allowed"
                                                    )}
                                                    onClick={(e) => !isCanceling && handleCancel(e, sub.id)}
                                                    disabled={isCanceling}
                                                    title="Aboneliği İptal Et"
                                                >
                                                    {isCanceling ? <Loader2 size={14} className="animate-spin" /> : <X size={16} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* İçerik */}
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={cn(
                                                "text-lg font-bold tracking-tight",
                                                isInactive
                                                    ? "text-zinc-500 dark:text-zinc-500 line-through decoration-zinc-300 dark:decoration-zinc-600 decoration-2"
                                                    : "text-zinc-900 dark:text-zinc-100"
                                            )}>
                                                {sub.name}
                                            </h3>
                                            <span className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border shrink-0",
                                                isInactive
                                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700"
                                                    : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-100 dark:border-zinc-700"
                                            )}>
                                                {sub.category}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium mb-5">
                                            <Calendar size={12} />
                                            <span>
                                                {isInactive ? `İptal: ${formatDate(sub.canceledDate) || 'Bilinmiyor'}` : `Başlangıç: ${formatDate(sub.startDate)}`}
                                            </span>
                                        </div>

                                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold">
                                                {isInactive ? (
                                                    <span className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
                                                        <XCircle size={14} /> Pasif
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 size={14} /> Aktif
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-baseline gap-0.5">
                                                <span className={cn(
                                                    "text-2xl font-black tracking-tighter tabular-nums",
                                                    isInactive
                                                        ? "text-zinc-400 dark:text-zinc-500"
                                                        : "text-zinc-900 dark:text-zinc-100"
                                                )}>
                                                    {formatMoneyClean(sub.price)}
                                                </span>
                                                <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500">₺</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* empty state */}
                        {displayedSubscriptions.length === 0 && (
                            <div className={cn(
                                "col-span-full py-24 text-center border-2 border-dashed rounded-[2.5rem]",
                                "border-zinc-200 dark:border-zinc-700/80",
                                "bg-zinc-50/50 dark:bg-zinc-900/40"
                            )}>
                                <svg className="mx-auto h-15 w-15 text-red-800/30 dark:text-red-400/20 mb-4 animate-pulse drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                                <h3 className="text-red-700 dark:text-red-400 font-bold text-lg">
                                    {viewFilter === 'active' ? 'Aktif abonelik bulunamadı' : 'Geçmiş abonelik bulunamadı'}
                                </h3>
                                <p className="text-red-800/70 dark:text-red-300/50 text-sm mb-6 max-w-xs mx-auto">
                                    {viewFilter === 'active'
                                        ? "Giderlerinizi takip etmeye başlamak için ilk aboneliğinizi ekleyin."
                                        : "İptal ettiğiniz abonelikler burada listelenir."}
                                </p>
                                {viewFilter === 'active' && (
                                    <Button
                                        className={cn(
                                            "px-6 py-3 rounded-xl shadow-lg",
                                            "bg-zinc-900 dark:bg-zinc-100",
                                            "text-white dark:text-zinc-900",
                                            "hover:bg-black dark:hover:bg-white",
                                            "shadow-zinc-200/60 dark:shadow-black/30",
                                            "border-transparent"
                                        )}
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

            {/* Düzenleme Modalı */}
            <Modal
                isOpen={!!editingSub}
                onClose={() => setEditingSub(null)}
                title={<span className="text-cyan-700 dark:text-cyan-400 font-bold">Aboneliği Düzenle</span>}
            >
                <AddSubscriptionForm
                    initialData={editingSub}
                    onSuccess={handleEditSuccess}
                />
            </Modal>

            {/* Silme Onay Modalı */}
            <Modal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                title="Kaydı Sil"
                variant="danger"
            >
                <div className="p-1">
                    <div className={cn(
                        "rounded-xl p-4 flex gap-4 mb-6 border",
                        "bg-red-50 dark:bg-red-950/30",
                        "border-red-100 dark:border-red-900/40"
                    )}>
                        <div className={cn(
                            "p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0 shadow-sm",
                            "bg-white dark:bg-zinc-800",
                            "text-red-500 dark:text-red-400",
                            "border border-red-100 dark:border-red-900/40"
                        )}>
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-900 dark:text-red-300 text-sm mb-1">Kalıcı İşlem</h4>
                            <p className="text-xs text-red-700 dark:text-red-400/80 leading-relaxed">
                                Bu abonelik kaydını ve geçmişe dönük tüm verilerini kalıcı olarak silmek üzeresiniz. Bu işlem geri alınamaz.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setDeletingId(null)}
                            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            Vazgeç
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white border-transparent shadow-lg shadow-red-200/60 dark:shadow-red-900/30"
                        >
                            Evet, Kalıcı Olarak Sil
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SubscriptionList;