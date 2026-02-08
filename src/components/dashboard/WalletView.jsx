import { useState, useEffect, useRef } from "react";
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
import { useData } from "../../context/DataContext"; useData
import { motion, AnimatePresence } from "framer-motion";

const WalletView = () => {
  
  
  const { transactions } = useData();
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

  const QUICK_ACTIONS = [
      { icon: Lock, label: "Kartı Dondur", color: "text-rose-600", bg: "bg-rose-50 hover:bg-rose-100 border-rose-100" },
      { icon: FileText, label: "Hesap Özeti", color: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-100 border-blue-100" },
      { icon: Shield, label: "Limit Ayarları", color: "text-emerald-600", bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-100" },
      { icon: Settings, label: "Kart Ayarları", color: "text-slate-600", bg: "bg-slate-50 hover:bg-slate-100 border-slate-200" },
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

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 pb-10">
      
     
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        
        <div className="w-full lg:w-96 xl:w-105 shrink-0 space-y-6">
            
            {/* Başlık ve Ekle Butonu */}
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-cyan-700 tracking-tight">Kartlarım</h2>
                <Button size="sm" className="flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-full font-semibold bg-cyan-700 hover:bg-cyan-500 text-white shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer">
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
                <div className="absolute inset-0 bg-[#0f172a]">
                    <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-purple-600/30 rounded-full blur-[80px] group-hover:bg-purple-500/40 transition-colors duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[60px] group-hover:bg-blue-500/30 transition-colors duration-500"></div>
                    
                
                    {/* parlama*/}
                    <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Kart İçeriği */}
                <div className="relative h-full w-full p-6 sm:p-8 flex flex-col justify-between text-white z-10">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-lg tracking-[0.2em] text-white/90">VAULT</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Wifi size={24} className="rotate-90 text-white/60" strokeWidth={2} />
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
                             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5 sm:h-6 w-auto brightness-0 invert opacity-90" />
                        </div>
                    </div>
                </div>
            </motion.div>
            
            {/* Limit Kontrolü */}
            <BentoCard glowColor="purple" className="p-6 sm:p-7 border border-slate-100/50 shadow-lg shadow-purple-500/5">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Shield size={16} /> Lİmİt Kontrolü
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl mt-2 font-black text-slate-900 tracking-tight">{formatCurrency(localLimit)}</span>
                            <span className="text-sm font-semibold text-slate-400">/ay</span>
                        </div>
                    </div>
                    <div className="bg-purple-100/50 text-purple-700 px-3 py-1.5 rounded-full text-[10px] font-bold border border-purple-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        Aktif
                    </div>
                </div>

                <div className="relative h-12 flex items-center group">
                    
                   
                    <div className="absolute w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-linear-to-r from-purple-500 to-indigo-600"
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
                        className="absolute h-7 w-7 bg-white rounded-full shadow-md border-4 border-purple-500 z-10 pointer-events-none flex items-center justify-center"
                        style={{ left: `calc(${(localLimit / 50000) * 100}% - 14px)` }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    </motion.div>
                </div>
                
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 font-mono">
                    <span>1K</span>
                    <span>25K</span>
                    <span>50K</span>
                </div>
            </BentoCard>

            {/* Hızlı İşlemler */}
            <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((action, index) => (
                    <button 
                        key={index} 
                        className={cn(
                            "flex flex-col items-start p-4 rounded-3xl transition-all duration-300 border bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group cursor-pointer",
                            action.bg
                        )}
                    >
                        <div className={cn("p-2.5 rounded-2xl mb-3 bg-white shadow-sm group-hover:scale-110 transition-transform", action.color)}>
                            <action.icon size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{action.label}</span>
                    </button>
                ))}
            </div>

        </div>

        {/* son işlemler */}
        <div className="flex-1 min-w-0">
            <BentoCard 
                glowColor="zinc" 
                className="h-fit p-0 overflow-hidden flex flex-col bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-4xl"
                whileHover={{}} 
            >
                
                {/* Header ve araçlar */}
                <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
                    <div>
                        <h3 className="text-2xl font-bold text-red-500 tracking-tight flex items-center gap-2">
                            Son İşlemler
                        </h3>
                        <p className="text-slate-400 text-xs font-medium mt-1">Kart harcamalarınızın detaylı dökümü</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        
                        {/* Arama Kutusu */}
                        <div className={cn(
                            "flex items-center bg-slate-50 border border-slate-200 rounded-2xl transition-all duration-300 ease-out overflow-hidden",
                            isSearchOpen ? "w-full sm:w-64 pl-3 pr-1 shadow-inner" : "w-10 h-10 justify-center border-transparent bg-transparent"
                        )}>
                            {isSearchOpen && (
                                <input 
                                    ref={searchInputRef}
                                    type="text" 
                                    placeholder="Harcama ara..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 h-10"
                                />
                            )}
                            
                            <button 
                                onClick={() => {
                                    setIsSearchOpen(!isSearchOpen);
                                    if (isSearchOpen) setSearchQuery(""); 
                                }}
                                className={cn(
                                    "flex items-center justify-center shrink-0 transition-colors cursor-pointer rounded-xl",
                                    isSearchOpen ? "w-8 h-8 hover:bg-slate-200 text-slate-500" : "w-10 h-10 hover:bg-slate-100 text-cyan-500 hover:text-slate-900"
                                )}
                            >
                                {isSearchOpen ? <X size={16} /> : <Search size={20} />}
                            </button>
                        </div>

                        {/* ince Çizgi */}
                        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

                        {/* İndirme Butonu */}
                        <button 
                            onClick={handleDownload}
                            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-cyan-500 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
                            title="CSV Olarak İndir"
                        >
                            <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                        </button>
                        
                    </div>
                </div>

                {/* Tablo */}
                <div className="flex-1 overflow-x-auto custom-scrollbar p-2">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 pl-8 first:rounded-tl-2xl">İşlem Detayı</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Kategori</th>
                                <th className="px-6 py-4 hidden md:table-cell">Tarih</th>
                                <th className="px-6 py-4 text-right pr-8 last:rounded-tr-2xl">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {visibleTransactions.length > 0 ? (
                                    visibleTransactions.map((tx, i) => (
                                        <motion.tr 
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="group hover:bg-slate-50/80 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-[18px] flex items-center justify-center shadow-sm border bg-white border-slate-100 p-2.5 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                                        {tx.icon ? (
                                                            <img src={tx.icon} alt={tx.name} className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                                        ) : (
                                                            <CreditCard size={20} className="text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{tx.name}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 sm:hidden">{tx.date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border bg-white border-slate-200 text-slate-600 shadow-sm group-hover:border-cyan-100 group-hover:bg-cyan-50/50 group-hover:text-cyan-600 transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-cyan-400 transition-colors"></span>
                                                    {tx.category || "Genel"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-xs font-semibold text-slate-500 hidden md:table-cell">
                                                {tx.date}
                                            </td>
                                            
                                            <td className="px-6 py-4 text-right pr-8">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-black tracking-tight text-slate-900 group-hover:text-indigo-900 transition-colors">
                                                        {formatCurrency(tx.amount)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 mt-0.5">
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
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                    <Search size={24} className="text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 font-medium">
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
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center backdrop-blur-sm">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="group flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:shadow-md transition-all duration-300 cursor-pointer"
                        >
                            {isExpanded ? (
                                <>
                                    Daha Az Göster <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                </>
                            ) : (
                                <>
                                    Tümünü Göster <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] group-hover:bg-slate-200 transition-colors">{filteredTransactions.length}</span> <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </BentoCard>
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
                    <div className="bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 rounded-3xl p-6 flex flex-col items-center text-center gap-4 mb-8">
                        <div className="bg-white p-4 rounded-full shadow-lg shadow-indigo-100 ring-4 ring-indigo-50 text-indigo-600">
                                <Shield size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-lg mb-2">Limit Güncelleme</h4>
                            <div className="flex items-center justify-center gap-3 text-2xl font-black text-slate-900 tracking-tight my-2">
                                <span className="text-slate-400 line-through text-lg">{formatCurrency(spendingLimit)}</span>
                                <span className="text-slate-300">→</span>
                                <span className="text-indigo-600">{formatCurrency(localLimit)}</span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                                Bu işlem banka onayı gerektirir ve aylık harcama limitinizi kalıcı olarak değiştirir.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="ghost" onClick={cancelLimitUpdate} className="rounded-xl h-12 font-bold text-slate-500 hover:bg-slate-50">Vazgeç</Button>
                        <Button onClick={startLimitUpdateProcess} className="bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-200 rounded-xl h-12">
                            Onayla ve Güncelle
                        </Button>
                    </div>
                </div>
            )}

            {limitStep === 'loading' && (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative bg-white p-5 rounded-full shadow-xl shadow-indigo-100 border border-indigo-50">
                            <Loader2 size={40} className="text-indigo-600 animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Banka ile İletişim Kuruluyor</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Güvenli bağlantı üzerinden limit sorgulaması yapılıyor, lütfen bekleyiniz...</p>
                </div>
            )}

            {limitStep === 'success' && (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-20 animate-ping"></div>
                        <div className="relative bg-white p-5 rounded-full shadow-xl shadow-emerald-100 border border-emerald-50">
                            <CheckCircle2 size={40} className="text-emerald-500" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Limit Başarıyla Güncellendi!</h3>
                    <p className="text-sm text-slate-500">Yeni harcama limitiniz hesabınıza anında tanımlandı.</p>
                </div>
            )}
        </div>
      </Modal>

    </div>
  );
};

export default WalletView;