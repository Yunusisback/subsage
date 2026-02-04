import { useState } from "react";
import { 
    Plus, Wifi, 
    Lock, FileText, Shield, Settings, 
    ChevronDown, ChevronUp, Download, Search
} from "lucide-react";
import BentoCard from "../ui/BentoCard";
import Button from "../ui/Button";
import { formatCurrency, cn } from "../../utils/helpers";
import { useGlobal } from "../../context/GlobalContext";
import { motion, AnimatePresence } from "framer-motion";

const WalletView = () => {
  
  const { transactions, userSettings } = useGlobal(); 
  const [isExpanded, setIsExpanded] = useState(false);

  // Sanal Limit State
  const [spendingLimit, setSpendingLimit] = useState(15000); 

  // Kartın altındaki butonlar
  const QUICK_ACTIONS = [
      { icon: Lock, label: "Kartı Dondur", color: "text-red-500", bg: "bg-red-50 hover:bg-red-100" },
      { icon: FileText, label: "Hesap Özeti", color: "text-blue-500", bg: "bg-blue-50 hover:bg-blue-100" },
      { icon: Shield, label: "Limit Ayarları", color: "text-green-500", bg: "bg-green-50 hover:bg-green-100" },
      { icon: Settings, label: "Kart Ayarları", color: "text-zinc-500", bg: "bg-zinc-100 hover:bg-zinc-200" },
  ];

  // Gösterilecek işlem sayısı
  const visibleTransactions = isExpanded ? transactions : transactions.slice(0, 5);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 pb-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kart ve İşlemler */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Başlık ve Ekle Butonu */}
            <div className="flex items-center justify-between ">
                <Button size="sm" className="flex items-center gap-1 pl-2 pr-4 rounded-full font-bold bg-white hover:bg-zinc-300 text-black shadow-sm hover:shadow-md border-transparent cursor-pointer">
                    <Plus size={16} strokeWidth={3} />
                    Kart Ekle
                </Button>
            </div>

            {/* Kredi Kartı Alanı  */}
            <motion.div 
                className="relative w-full max-w-sm aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl cursor-default"
                whileHover={{ scale: 1.05, y: -5 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Arka Plan Gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">

                    {/* Parlama Efekti */}
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-linear-to-b from-white/10 via-transparent to-transparent transform rotate-45 pointer-events-none"></div>
                </div>
                
                {/* Kart İçeriği */}
                <div className="relative h-full w-full p-6 flex flex-col justify-between text-white/90 z-10">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-lg tracking-[0.2em] drop-shadow-md text-white">VAULT</h3>
                            <div className="flex items-center gap-4 pl-1">
                                <svg className="w-11 h-8 rounded-md drop-shadow-sm" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="36" rx="6" fill="#e3d10e" />
                                    <path d="M48 18H0" stroke="#ffea05" strokeWidth="1" />
                                    <path d="M16 0V36" stroke="#ffea05" strokeWidth="1" />
                                    <path d="M32 0V36" stroke="#ffea05" strokeWidth="1" />
                                    <rect x="6" y="6" width="36" height="24" rx="4" stroke="#ffea05" strokeWidth="1" />
                                    <rect x="10" y="10" width="28" height="16" rx="2" stroke="#ffea05" strokeWidth="1" />
                                </svg>
                                <Wifi size={22} className="rotate-90 text-white/80 drop-shadow-md" strokeWidth={2} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-2 flex justify-center">
                        <div className="font-mono text-2xl sm:text-[26px] tracking-[0.15em] text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] flex gap-4 font-medium">
                            <span>4556</span>
                            <span>3325</span>
                            <span>8590</span>
                            <span>3732</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end mb-1">
                        <div className="flex gap-10">
                            <div className="flex flex-col">
                                <span className="text-[8px] uppercase text-white/70 mb-0.5 tracking-wider">VALID THRU</span>
                                <span className="text-sm font-bold text-white drop-shadow-sm font-mono tracking-wide">09/28</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] uppercase text-white/70 mb-0.5 tracking-wider">CARD HOLDER</span>
                                <span className="text-sm font-bold text-white drop-shadow-sm tracking-wide uppercase">
                                    {userSettings.name}
                                </span>
                            </div>
                        </div>
                        <div className="w-14">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="w-full h-auto brightness-0 invert drop-shadow-md opacity-90" />
                        </div>
                    </div>
                </div>
            </motion.div>
            
            {/* Sanal Harcama Limiti  */}
            <BentoCard glowColor="purple" className="p-5">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Kullanılabilir Bakiye</h3>
                        <div className="text-2xl font-black text-zinc-900 tracking-tight">
                            {formatCurrency(spendingLimit)}
                        </div>
                    </div>
                    <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold border border-purple-100">
                        Sanal Kart
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                        <span>1.000₺</span>
                        <span>50.000₺</span>
                    </div>
                    <input 
                        type="range" 
                        min="1000" 
                        max="50000" 
                        step="500" 
                        value={spendingLimit} 
                        onChange={(e) => setSpendingLimit(Number(e.target.value))}
                        className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-purple-600 hover:accent-purple-500 transition-all"
                    />
                    <p className="text-xs text-zinc-400 text-center">
                        Limit değiştirmek için kaydırın
                    </p>
                </div>
            </BentoCard>

            {/* Hızlı İşlemler */}
            <BentoCard glowColor="zinc" className="p-6">
                <h3 className="text-sm font-bold text-yellow-900 mb-4">Hızlı İşlemler</h3>
                <div className="grid grid-cols-2 gap-3">
                    {QUICK_ACTIONS.map((action, index) => (
                        <button 
                            key={index} 
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 border border-transparent hover:scale-[1.02] cursor-pointer",
                                action.bg
                            )}
                        >
                            <action.icon size={20} className={action.color} />
                            <span className="text-xs font-bold text-zinc-700">{action.label}</span>
                        </button>
                    ))}
                </div>
            </BentoCard>

        </div>

        {/* İşlem Geçmişi */}
        <div className="lg:col-span-2">
            <BentoCard 
                glowColor="zinc" 
                className="h-full p-0 overflow-hidden flex flex-col min-h-125"
                whileHover={{}} 
            >
                
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div>
                        <h3 className="text-2xl mr-50 font-bold text-red-900">Son İşlemler</h3>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
                            <Search size={20} />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
                            <Download size={20} />
                        </button>
                    </div>
                </div>

                {/* Tablo */}
                <div className="flex-1 p-2">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-50/50 text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-4 py-3 rounded-l-xl pl-6">Platform</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Kategori</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Tarih</th>
                                <th className="px-4 py-3 text-right rounded-r-xl pr-6">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            <AnimatePresence>
                                {visibleTransactions.map((tx) => (
                                    <motion.tr 
                                        key={tx.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="group hover:bg-zinc-50 hover:scale-[1.01] hover:shadow-sm transition-all duration-200 origin-center"
                                    >
                                        <td className="px-4 py-4 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border bg-white border-zinc-100 p-2 group-hover:scale-110 transition-transform">
                                                    <img src={tx.icon} alt={tx.name} className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900 group-hover:text-yellow-700 transition-colors">{tx.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-white border-zinc-200 text-zinc-500 shadow-sm">
                                                {tx.category || "Genel"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-xs font-medium text-zinc-500 hidden sm:table-cell">
                                            {tx.date}
                                        </td>
                                        <td className="px-4 py-4 text-right pr-6">
                                            <span className="text-sm font-black tracking-tight text-red-600">
                                                {formatCurrency(tx.amount)}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    
                    {/* Boş Durum */}
                    {transactions.length === 0 && (
                        <div className="p-10 text-center text-zinc-400 text-sm">
                            Henüz işlem geçmişi yok.
                        </div>
                    )}
                </div>

                {/* Genişletme Butonu */}
                {transactions.length > 5 && (
                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/30 flex justify-center">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-zinc-800 hover:text-zinc-900 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-zinc-200 cursor-pointer"
                        >
                            {isExpanded ? (
                                <>
                                    Daha Az Göster <ChevronUp size={14} />
                                </>
                            ) : (
                                <>
                                    Tümünü Göster ({transactions.length}) <ChevronDown size={14} />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </BentoCard>
        </div>

      </div>
    </div>
  );
};

export default WalletView;