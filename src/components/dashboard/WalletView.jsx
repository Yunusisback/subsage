import { CreditCard, Wallet, MoreHorizontal, Copy, Wifi, CheckCircle2, Plus } from "lucide-react";
import BentoCard from "../ui/BentoCard";
import Button from "../ui/Button";
import { formatCurrency, cn } from "../../utils/helpers";
import { useGlobal } from "../../context/GlobalContext";

// abonelik verileri
const MOCK_TRANSACTIONS = [
  { id: 1, name: "Netflix", date: "Bugün, 14:30", amount: -199.99, type: "subscription", icon: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { id: 2, name: "Spotify", date: "24 Ocak 2025", amount: -59.99, type: "subscription", icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
  { id: 3, name: "Amazon Prime", date: "22 Ocak 2025", amount: -39.00, type: "subscription", icon: "https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png" },
  { id: 4, name: "YouTube Premium", date: "15 Ocak 2025", amount: -57.99, type: "subscription", icon: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" },
  { id: 5, name: "iCloud+", date: "05 Ocak 2025", amount: -12.99, type: "subscription", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1c/ICloud_logo.svg" },
];

const WalletView = () => {
  const { totalExpenses } = useGlobal();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 pb-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* sol bölüm kart ve bakiye */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* başlık ve kart ekle butonu */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">Kartlarım</h2>
                <Button size="sm" className="flex items-center gap-1 pl-2 pr-3 rounded-full font-bold bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm hover:shadow-md border-transparent">
                    <Plus size={16} strokeWidth={3} />
                    Kart Ekle
                </Button>
            </div>

            {/* kredi kartı tasarımı */}
            <div className="relative w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl group perspective-1000 bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#db2777]">
                
                {/* arka plan efektleri */}
                <div className="absolute top-[-30%] left-[-20%] w-72 h-72 bg-[#a78bfa] rounded-full blur-[80px] opacity-60"></div>
                <div className="absolute bottom-[-30%] right-[-20%] w-72 h-72 bg-[#60a5fa] rounded-full blur-[80px] opacity-60"></div>

                {/* kart katmanı */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 p-7 flex flex-col justify-between text-white shadow-inner">
                    
                    {/* üst kısım çip ve logo */}
                    <div className="flex justify-between items-start">
                        {/* çip */}
                        <div className="w-11 h-8 rounded-md bg-white/20 border border-white/30 flex items-center justify-center relative overflow-hidden backdrop-blur-md">
                             <div className="w-full h-[1px] bg-white/40 absolute top-1/3"></div>
                             <div className="w-full h-[1px] bg-white/40 absolute bottom-1/3"></div>
                             <div className="h-full w-[1px] bg-white/40 absolute left-1/3"></div>
                             <div className="h-full w-[1px] bg-white/40 absolute right-1/3"></div>
                        </div>

                        {/* visa logosu */}
                        <span className="italic font-black text-2xl tracking-tighter text-white opacity-90 drop-shadow-md leading-none">VISA</span>
                    </div>

                    {/* kart numarası */}
                    <div className="mt-4 mb-2">
                        <div className="font-mono text-xl sm:text-2xl tracking-[0.15em] text-white drop-shadow-sm flex justify-between">
                            <span>4556</span>
                            <span>3325</span>
                            <span>8590</span>
                            <span>3732</span>
                        </div>
                    </div>

                    {/* alt bilgiler */}
                    <div className="flex justify-between items-end text-xs font-medium tracking-wider uppercase text-white/90">
                         {/* kart sahibi */}
                         <div className="flex flex-col gap-1">
                             <span className="text-[9px] opacity-70">Kart Sahibi</span>
                             <span className="text-sm font-bold text-white drop-shadow-sm tracking-wide">BURAK YILMAZ</span>
                         </div>

                         {/* tarih */}
                         <div className="flex flex-col items-end gap-1">
                             <span className="text-[9px] opacity-70">SKT</span>
                             <span className="text-sm font-bold text-white drop-shadow-sm font-mono">09/28</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* toplam bakiye kartı */}
            <BentoCard glowColor="blue" className="p-6 relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-white border-blue-100">
                <div className="flex flex-col items-center text-center mb-4">
                     <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.15em] mb-2">TOPLAM BAKİYE</h4>
                     <span className="text-4xl font-black text-zinc-900 tracking-tighter">
                        124.500 <span className="text-xl text-zinc-400 font-bold">₺</span>
                     </span>
                </div>
                
                {/* sol alt ikon */}
                <div className="absolute bottom-6 left-6">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm hover:scale-105 transition-transform">
                        <Wallet size={24} strokeWidth={2} />
                    </div>
                </div>
            </BentoCard>

            {/* limit durumu kartı */}
            <BentoCard glowColor="zinc" className="p-5">
                 <div className="flex justify-between items-end mb-2">
                     <h4 className="text-sm font-bold text-zinc-900">Aylık Harcama Limiti</h4>
                     <span className="text-xs font-bold text-zinc-500">%65 Kullanıldı</span>
                 </div>
                 <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                     <div className="h-full bg-yellow-500 w-[65%] rounded-full shadow-sm"></div>
                 </div>
                 <div className="mt-2 text-xs text-zinc-400 font-medium">
                     Kalan Limit: <span className="text-zinc-900 font-bold">12.450₺</span>
                 </div>
            </BentoCard>

        </div>

        {/* sağ bölüm işlem geçmişi */}
        <div className="lg:col-span-2">
            <BentoCard glowColor="zinc" className="h-full p-0 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900">Son İşlemler</h3>
                        <p className="text-xs text-zinc-500 font-medium">Bu kart ile yapılan abonelik ödemeleri.</p>
                    </div>
                    <button className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-50/50 text-zinc-400 text-[10px] uppercase tracking-wider font-bold sticky top-0">
                            <tr>
                                <th className="px-4 py-3 rounded-l-xl">Platform</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Kategori</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Tarih</th>
                                <th className="px-4 py-3 text-right rounded-r-xl">Tutar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {MOCK_TRANSACTIONS.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-zinc-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border bg-white border-zinc-100 p-2">
                                                <img src={tx.icon} alt={tx.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900 group-hover:text-yellow-700 transition-colors">{tx.name}</p>
                                                <p className="text-[10px] text-zinc-500 sm:hidden">{tx.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 hidden sm:table-cell">
                                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-purple-50 text-purple-600 border-purple-100">
                                            Abonelik
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-xs font-medium text-zinc-500 hidden sm:table-cell">
                                        {tx.date}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <span className="text-sm font-black tracking-tight text-zinc-900">
                                            {formatCurrency(tx.amount)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </BentoCard>
        </div>

      </div>
    </div>
  );
};

export default WalletView;