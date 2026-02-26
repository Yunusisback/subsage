import { useState, useEffect, useRef, useMemo } from "react";
import { 
    Plus, Wifi, 
    Lock, FileText, Shield, Settings, 
    ChevronDown, ChevronUp, Download, Search,
    Loader2, CheckCircle2, X,
    CreditCard
} from "lucide-react";
import BentoCard from "../ui/BentoCard";
import Button from "../ui/Button";
import Modal from "../ui/Modal"; 
import { formatCurrency, cn } from "../../utils/helpers";
import { useUser } from "../../context/UserContext"; 
import { useData } from "../../context/DataContext"; 
import { motion, AnimatePresence } from "framer-motion";

const CHART_COLORS = ['#f97316', '#06b6d4', '#84cc16', '#eab308', '#ec4899', '#8b5cf6'];


const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const WalletView = () => {
  
  
  const { transactions, subscriptions } = useData();
  const { userSettings, spendingLimit, updateSpendingLimit } = useUser();
  
  const [isExpanded, setIsExpanded] = useState(false);

 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  
  const [localLimit, setLocalLimit] = useState(spendingLimit);
  
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitStep, setLimitStep] = useState('confirm'); 

  useEffect(() => {
    setLocalLimit(spendingLimit);
  }, [spendingLimit]);

  useEffect(() => {
      if (isSearchOpen && searchInputRef.current) {
          searchInputRef.current.focus();
      }
  }, [isSearchOpen]);

 
  const filteredTransactions = transactions.filter(tx => 
      tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.category && tx.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const visibleTransactions = isExpanded ? filteredTransactions : filteredTransactions.slice(0, 5);

  const currentSpend = useMemo(() => {
      return transactions.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
  }, [transactions]);

  const fillPercentage = localLimit > 0 ? (currentSpend / localLimit) * 100 : 0;

  const QUICK_ACTIONS = [
      { icon: Lock, label: "Kartı Dondur", color: "text-rose-600", bg: "bg-rose-50 hover:bg-rose-100 border-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 dark:border-rose-900/50" },
      { icon: FileText, label: "Hesap Özeti", color: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-100 border-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 dark:border-blue-900/50" },
      { icon: Shield, label: "Limit Ayarları", color: "text-emerald-600", bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 dark:border-emerald-900/50" },
      { icon: Settings, label: "Kart Ayarları", color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:border-zinc-600" },
  ];

  const handleSliderChange = (e) => {
      setLocalLimit(Number(e.target.value));
  };

  const handleSliderRelease = () => {
      if (localLimit !== spendingLimit) {
          setLimitStep('confirm');
          setShowLimitModal(true);
      }
  };

  const startLimitUpdateProcess = () => {
      setLimitStep('loading');
      setTimeout(() => {
          setLimitStep('success');
          updateSpendingLimit(localLimit);
          setTimeout(() => {
              setShowLimitModal(false);
              setLimitStep('confirm'); 
          }, 1500);
      }, 2000);
  };

  const cancelLimitUpdate = () => {
      setLocalLimit(spendingLimit);
      setShowLimitModal(false);
  };

  const handleDownload = () => {
    const dataToExport = filteredTransactions;
    if (dataToExport.length === 0) {
        alert("İndirilecek veri bulunamadı.");
        return;
    }
    const headers = ["Platform", "Kategori", "Tarih", "Tutar"];
    const csvRows = [
        headers.join(","), 
        ...dataToExport.map(tx => {
            return [
                `"${tx.name}"`, 
                `"${tx.category || 'Genel'}"`,
                `"${tx.date}"`,
                `"${tx.amount}"`
            ].join(",");
        })
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SubSage_Harcamalar_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categoryData = useMemo(() => {
    if (!subscriptions) return [];
    return subscriptions.reduce((acc, sub) => {
      if(sub.status !== 'active') return acc;
      const found = acc.find(c => c.name === sub.category);
      if (found) {
        found.value += parseFloat(sub.price);
        found.count += 1;
      } else {
        acc.push({ name: sub.category, value: parseFloat(sub.price), count: 1 });
      }
      return acc;
    }, []);
  }, [subscriptions]);

  const getCategoryColor = (categoryName) => {
    if (!categoryName) return '#94a3b8'; 
    const index = categoryData.findIndex(c => c.name === categoryName);
    if (index !== -1) {
        return CHART_COLORS[index % CHART_COLORS.length];
    }
    return '#94a3b8'; 
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 pb-10">
      
      
      <div className="flex flex-col gap-6 lg:gap-8">
        
     
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
            
        
            <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 space-y-6 flex flex-col justify-center">
                
                {/* Başlık ve Ekle Butonu */}
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-bold text-cyan-700 dark:text-cyan-400 tracking-tight">Kartlarım</h2>
                    <Button size="sm" className="flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-full font-semibold bg-cyan-700 hover:bg-cyan-500 text-white shadow-lg shadow-slate-200 dark:shadow-black/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                        <Plus size={16} strokeWidth={2.5} />
                        <span className="text-xs">Yeni Kart</span>
                    </Button>
                </div>

               {/*Kredi Kartı Alanı*/}
                <motion.div 
                    className="relative w-full aspect-[1.586/1] rounded-4xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] cursor-pointer group"
                    whileHover={{ y: -5, scale: 1.01 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {/* Arka Plan */}
                    <div className="absolute inset-0 bg-[#030d25]">
                        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-cyan-900 rounded-full blur-[80px] group-hover:bg-cyan-500/40 transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[60px] group-hover:bg-blue-500/30 transition-colors duration-500"></div>
                        
                    
                        {/* parlama*/}
                        <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Kart İçeriği */}
                    <div className="relative h-full w-full p-6 sm:p-8 flex flex-col justify-between text-white z-10">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                <span className="text-3xl text-white ">V A U L T</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Wifi size={33} className="rotate-90 text-white/60" strokeWidth={2} />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 my-auto">
                            <div className="w-12 h-9 shrink-0 rounded-md bg-linear-to-br from-yellow-200 to-yellow-500 shadow-inner flex items-center justify-center relative overflow-hidden">
                                 <div className="absolute inset-0 border border-black/10 rounded-md"></div>
                                 <div className="w-full h-px bg-black/20 absolute top-1/3"></div>
                                 <div className="w-full h-px bg-black/20 absolute bottom-1/3"></div>
                                 <div className="h-full w-px bg-black/20 absolute left-1/3"></div>
                                 <div className="h-full w-px bg-black/20 absolute right-1/3"></div>
                            </div>
                           
                            <div className="font-mono text-base sm:text-xl tracking-[0.12em] text-white/90 flex gap-3 sm:gap-4 drop-shadow-md whitespace-nowrap">
                                <span>••••</span> <span>••••</span> <span>••••</span> <span>3732</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase text-white/50 mb-1 tracking-wider font-semibold">Kart Sahibi</span>
                                <span className="text-sm font-bold text-white tracking-wide uppercase truncate max-w-37.5">
                                    {userSettings.name}
                                </span>
                            </div>
                            
                            {/* valid thru */}
                            <div className="flex flex-col items-center">
                                 <span className="text-[7px] uppercase text-white/50 mb-0.5 tracking-wider font-semibold">VALID THRU</span>
                                 <span className="text-sm font-bold text-white tracking-widest">12/28</span>
                            </div>

                          <div className="flex flex-col items-end">
                                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg" alt="Visa" className="h-5 sm:h-8 w-auto brightness-0 invert opacity-60" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

       
            <div className="flex-1 w-full flex flex-col justify-end mt-6 lg:mt-0">
                {/* Limit Kontrolü */}
                <BentoCard glowColor={fillPercentage >= 100 ? "red" : "cyan"} className="p-5 sm:p-6 border border-slate-100/50 dark:border-zinc-700/50 shadow-lg bg-white dark:bg-zinc-800 relative overflow-hidden group/limit transition-all duration-500 w-full lg:h-[240px] xl:h-[265px] flex flex-col justify-between">
                    
                    <div className={cn(
                        "absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-700",
                        fillPercentage >= 100 ? "bg-red-100 dark:bg-red-900/20" : (fillPercentage > 75 ? "bg-amber-100 dark:bg-amber-900/20" : "bg-cyan-50 dark:bg-cyan-900/20")
                    )}></div>

                    <div className="relative z-10 flex justify-between items-center mb-2">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Shield size={16} className={fillPercentage >= 100 ? "text-red-500" : "text-cyan-500"} /> 
                            Aylık Limit Kontrolü
                        </h3>
                        <div className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 shadow-sm transition-colors",
                            fillPercentage >= 100 ? "bg-red-50 dark:bg-red-950/40 text-red-600 border-red-100 dark:border-red-900/50" : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
                        )}>
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                fillPercentage >= 100 ? "bg-red-500" : "bg-emerald-500"
                            )}></span>
                            {fillPercentage >= 100 ? "Aşıldı" : "Aktif"}
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Kullanılan Tutar</span>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl lg:text-3xl xl:text-4xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">{formatCurrency(currentSpend)}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 mt-1">/ {formatCurrency(localLimit)}</span>
                    </div>

                    <div className="relative z-10 mt-3 pt-3 border-t border-slate-100/60 dark:border-zinc-700/60">
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Doluluk</span>
                            <span className={cn(
                                "text-sm font-black tracking-tight",
                                fillPercentage >= 100 ? "text-red-500" : (fillPercentage > 75 ? "text-amber-500" : "text-cyan-600 dark:text-cyan-400")
                            )}>
                                %{fillPercentage.toFixed(1)}
                            </span>
                        </div>
                        
                        <div className="h-2 w-full bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden shadow-inner relative mb-3">
                            <motion.div 
                                className={cn(
                                    "h-full rounded-full shadow-sm",
                                    fillPercentage >= 100 ? "bg-red-500" : (fillPercentage > 75 ? "bg-amber-400" : "bg-cyan-500")
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(fillPercentage, 100)}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>

                        <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">
                            <span>LİMİTİ AYARLA</span>
                            <span className="text-cyan-600 dark:text-cyan-400 font-mono">50K MAX</span>
                        </div>
                        
                        <div className="relative h-5 flex items-center group/slider">
                            <div className="absolute w-full h-1.5 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden shadow-inner">
                                <motion.div 
                                    className="h-full bg-linear-to-r from-slate-300 to-slate-400 dark:from-zinc-500 dark:to-zinc-400 opacity-50 transition-all duration-300"
                                    style={{ width: `${(localLimit / 50000) * 100}%` }}
                                />
                            </div>
                            
                            <input 
                                type="range" 
                                min="1000" 
                                max="50000" 
                                step="500" 
                                value={localLimit} 
                                onChange={handleSliderChange}
                                onMouseUp={handleSliderRelease}
                                onTouchEnd={handleSliderRelease}
                                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                            />

                            <motion.div 
                                className="absolute h-5 w-5 bg-white dark:bg-zinc-200 rounded-full shadow-md shadow-slate-300/50 border-[3px] border-cyan-500 z-10 pointer-events-none flex items-center justify-center transition-colors group-hover/slider:border-cyan-400"
                                style={{ left: `calc(${(localLimit / 50000) * 100}% - 10px)` }}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                            >
                            </motion.div>
                        </div>
                    </div>
                </BentoCard>
            </div>
        </div>

      
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {/* Hızlı İşlemler */}
            {QUICK_ACTIONS.map((action, index) => (
                <button 
                    key={index} 
                    className={cn(
                        "flex flex-col items-center justify-center text-center p-4 rounded-3xl transition-all duration-300 border bg-white dark:bg-zinc-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group cursor-pointer",
                        action.bg
                    )}
                >
                    <div className={cn("p-2.5 rounded-2xl mb-3 bg-white dark:bg-zinc-700 shadow-sm group-hover:scale-110 transition-transform", action.color)}>
                        <action.icon size={22} strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{action.label}</span>
                </button>
            ))}
        </div>

   
        <div className="w-full mt-2">
            {/* son işlemler */}
            <div className="flex-1 min-w-0 w-full">
                <BentoCard 
                    glowColor="zinc" 
                    className="h-fit p-0 overflow-hidden flex flex-col bg-white dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 shadow-xl shadow-slate-200/40 dark:shadow-black/30 rounded-4xl w-full"
                    whileHover={{}} 
                >
                    
                    {/* Header ve araçlar */}
                    <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl sticky top-0 z-30">
                        <div>
                            <h3 className="text-2xl font-bold text-red-500 dark:text-red-400 tracking-tight flex items-center gap-2">
                                Son İşlemler
                            </h3>
                            <p className="text-slate-400 dark:text-zinc-500 text-xs font-medium mt-1">Kart harcamalarınızın detaylı dökümü</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            
                            {/* Arama Kutusu */}
                            <div className={cn(
                                "flex items-center bg-slate-50 dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-2xl transition-all duration-200 ease-out overflow-hidden",
                                isSearchOpen ? "w-full sm:w-64 pl-3 pr-1 shadow-inner" : "w-10 h-10 justify-center border-transparent bg-transparent"
                            )}>
                                {isSearchOpen && (
                                    <input 
                                        ref={searchInputRef}
                                        type="text" 
                                        placeholder="Harcama ara..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 h-10"
                                    />
                                )}
                                
                                <button 
                                    onClick={() => {
                                        setIsSearchOpen(!isSearchOpen);
                                        if (isSearchOpen) setSearchQuery(""); 
                                    }}
                                    className={cn(
                                        "flex items-center justify-center shrink-0 transition-colors cursor-pointer rounded-xl",
                                        isSearchOpen ? "w-8 h-8 hover:bg-slate-200 dark:hover:bg-zinc-600 text-slate-500 dark:text-zinc-400" : "w-10 h-10 hover:bg-slate-100 dark:hover:bg-zinc-700 text-cyan-500 hover:text-slate-900 dark:hover:text-zinc-100"
                                    )}
                                >
                                    {isSearchOpen ? <X size={16} /> : <Search size={20} />}
                                </button>
                            </div>

                            {/* ince Çizgi */}
                            <div className="w-px h-6 bg-slate-200 dark:bg-zinc-700 mx-1 hidden sm:block"></div>

                            {/* İndirme Butonu */}
                            <button 
                                onClick={handleDownload}
                                className="p-2.5 rounded-2xl bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 text-cyan-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-500 hover:shadow-sm transition-all cursor-pointer group"
                                title="CSV Olarak İndir"
                            >
                                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                            </button>
                            
                        </div>
                    </div>

                    {/* Tablo */}
                    <div className="flex-1 overflow-x-auto custom-scrollbar p-2">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 dark:bg-zinc-900/50 text-cyan-900 dark:text-cyan-300 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100 dark:border-zinc-700">
                                <tr>
                                    <th className="px-6 py-4 pl-8 first:rounded-tl-2xl">İşlem Detayı</th>
                                    <th className="px-6 py-4 hidden sm:table-cell">Kategori</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Tarih</th>
                                    <th className="px-6 py-4 text-right pr-8 last:rounded-tr-2xl">Tutar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-700/50">
                                <AnimatePresence mode="popLayout">
                                    {visibleTransactions.length > 0 ? (
                                        visibleTransactions.map((tx, i) => (
                                            <motion.tr 
                                                key={tx.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="group hover:bg-slate-50/80 dark:hover:bg-zinc-700/40 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 pl-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-[18px] flex items-center justify-center shadow-sm border bg-white dark:bg-zinc-700 border-slate-100 dark:border-zinc-600 p-2.5 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                                            {tx.icon ? (
                                                                <img src={tx.icon} alt={tx.name} className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                                            ) : (
                                                                <CreditCard size={20} className="text-slate-300 dark:text-zinc-500" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 transition-colors">{tx.name}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 sm:hidden">{tx.date}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    {(() => {
                                                        const colorHex = getCategoryColor(tx.category);
                                                        return (
                                                            <span 
                                                                className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm"
                                                                style={{ 
                                                                    backgroundColor: hexToRgba(colorHex, 0.9),
                                                                    color: '#ffffff'
                                                                }}
                                                            >
                                                                <span 
                                                                    className="w-1.5 h-1.5 rounded-full shadow-xs" 
                                                                    style={{ backgroundColor: '#ffffff' }}
                                                                ></span>
                                                                {tx.category || "Genel"}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>

                                                <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 hidden md:table-cell">
                                                    {tx.date}
                                                </td>
                                                
                                                <td className="px-6 py-4 text-right pr-8">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-sm font-black tracking-tight text-red-600 dark:text-red-400 group-hover:text-cyan-900 dark:group-hover:text-cyan-300 transition-colors">
                                                            {formatCurrency(tx.amount)}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded flex items-center gap-0.5 mt-0.5">
                                                            <CheckCircle2 size={10} /> Onaylandı
                                                        </span>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-50">
                                                    <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mb-4">
                                                        <Search size={24} className="text-slate-400 dark:text-zinc-500" />
                                                    </div>
                                                    <p className="text-slate-500 dark:text-zinc-400 font-medium">
                                                        {searchQuery ? `"${searchQuery}" için sonuç bulunamadı.` : "Henüz işlem geçmişi yok."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer- genişletme butonu */}
                    {filteredTransactions.length > 5 && (
                        <div className="p-4 border-t border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/30 flex justify-center backdrop-blur-sm">
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="group flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 hover:border-slate-300 dark:hover:border-zinc-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                {isExpanded ? (
                                    <>
                                        Daha Az Göster <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                    </>
                                ) : (
                                    <>
                                        Tümünü Göster <span className="bg-slate-100 dark:bg-zinc-600 text-slate-500 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[10px] group-hover:bg-slate-200 dark:group-hover:bg-zinc-500 transition-colors">{filteredTransactions.length}</span> <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </BentoCard>
            </div>
        </div>

      </div>

      {/* Limit değişiklik modalı*/}
      <Modal
        isOpen={showLimitModal}
        onClose={limitStep === 'loading' ? () => {} : cancelLimitUpdate} 
        title={limitStep === 'confirm' ? "Limit Değişikliği" : ""}
      >
        <div className="p-4">
            
            {limitStep === 'confirm' && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-linear-to-br from-red-500 to-red-900 border border-red-100/50 rounded-3xl p-6 flex flex-col items-center text-center gap-4 mb-8">
                        <div className="bg-white p-4 rounded-full shadow-lg shadow-red-100 ring-4 ring-red-50 text-red-600">
                                <Shield size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg mb-2">Limit Güncelleme</h4>
                            <div className="flex items-center justify-center gap-3 text-2xl font-black text-slate-900 tracking-tight my-2">
                                <span className="text-slate-200 line-through text-lg">{formatCurrency(spendingLimit)}</span>
                                <span className="text-slate-300">→</span>
                                <span className="text-yellow-300">{formatCurrency(localLimit)}</span>
                            </div>
                            <p className="text-sm text-white leading-relaxed max-w-xs mx-auto">
                                Bu işlem banka onayı gerektirir ve aylık harcama limitinizi kalıcı olarak değiştirir.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="ghost" onClick={cancelLimitUpdate} className="rounded-3xl h-12 font-bold text-white hover:bg-red-500 bg-zinc-500 cursor-pointer hover:scale-90">Vazgeç</Button>
                        <Button onClick={startLimitUpdateProcess} className="bg-red-600 hover:bg-red-700 text-white  shadow-red-500 rounded-3xl h-12 cursor-pointer hover:scale-90">
                            Onayla ve Güncelle
                        </Button>
                    </div>
                </div>
            )}

            {limitStep === 'loading' && (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative bg-white dark:bg-zinc-800 p-5 rounded-full shadow-xl shadow-red-100 dark:shadow-red-900/20 border border-red-50 dark:border-red-900/30">
                            <Loader2 size={40} className="text-red-600 animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Banka ile İletişim Kuruluyor</h3>
                    <p className="text-sm text-red-500 dark:text-red-400 max-w-xs mx-auto">Güvenli bağlantı üzerinden limit sorgulaması yapılıyor, lütfen bekleyiniz...</p>
                </div>
            )}

            {limitStep === 'success' && (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-20 animate-ping"></div>
                        <div className="relative bg-white dark:bg-zinc-800 p-5 rounded-full shadow-xl shadow-emerald-100 dark:shadow-emerald-900/20 border border-emerald-50 dark:border-emerald-900/30">
                            <CheckCircle2 size={40} className="text-emerald-500" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Limit Başarıyla Güncellendi!</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Yeni harcama limitiniz hesabınıza anında tanımlandı.</p>
                </div>
            )}
        </div>
      </Modal>

    </div>
  );
};

export default WalletView;