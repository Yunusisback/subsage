import { useGlobal } from "../../context/GlobalContext";
import BentoCard from "../ui/BentoCard";
import { formatCurrency } from "../../utils/helpers";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, PiggyBank, Activity, Target } from "lucide-react";

const COLORS = ['#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#f87171'];

const SummaryChart = () => {
  const { subscriptions, totalExpenses } = useGlobal();

  if (subscriptions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-96 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20 text-zinc-500">
            <Activity size={48} className="mb-4 opacity-50" />
            <p>Raporları görmek için önce abonelik eklemelisiniz.</p>
        </div>
    )
  }

  // kategori verisi
  const categoryData = subscriptions.reduce((acc, curr) => {
    const existingCategory = acc.find(item => item.name === curr.category);
    if (existingCategory) {
      existingCategory.value += parseFloat(curr.price);
    } else {
      acc.push({ name: curr.category, value: parseFloat(curr.price) });
    }
    return acc;
  }, []);

  // abonelik sıralama
  const subscriptionData = subscriptions.map(sub => ({
    name: sub.name,
    price: parseFloat(sub.price)
  })).sort((a, b) => b.price - a.price);

  const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0];
        return (
          <div className="bg-background/95 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] z-50">
            <p className="text-zinc-400 text-[10px] font-bold mb-0.5 uppercase tracking-wider">{data.name}</p>
            <p className="text-white font-black text-lg">{formatCurrency(data.value)}</p>
          </div>
        );
      }
      return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
        
      {/* üst kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* toplam gider kartı */}
        <BentoCard glowColor="yellow" className="p-0 h-40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col justify-between h-full p-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                            <PiggyBank size={22} />
                        </div>
                        <h3 className="text-yellow-100/70 text-xs font-bold uppercase tracking-[0.2em]">Toplam Gider</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/10 text-[10px] font-bold text-yellow-400">AYLIK</span>
                </div>

                <div>
                    <p className="text-5xl font-black tracking-tighter bg-linear-to-r from-white via-yellow-100 to-yellow-500/50 bg-clip-text text-transparent drop-shadow-sm">
                        {formatCurrency(totalExpenses).replace(",00", "").replace("₺", "")}
                        <span className="text-2xl font-medium text-yellow-500/50 ml-1">₺</span>
                    </p>
                </div>
            </div>

            <PiggyBank className="absolute -bottom-8 -right-8 w-48 h-48 text-yellow-500/5 rotate-[-15deg] group-hover:scale-110 group-hover:rotate-[-5deg] transition-transform duration-500 ease-out" />
        </BentoCard>

        {/* yıllık tahmin kartı */}
        <BentoCard glowColor="green" className="p-0 h-40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            <div className="relative z-10 flex flex-col justify-between h-full p-8">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-green-500/20 border border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            <Target size={22} />
                        </div>
                        <h3 className="text-green-100/70 text-xs font-bold uppercase tracking-[0.2em]">Yıllık Tahmin</h3>
                    </div>
                     <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/10 text-[10px] font-bold text-green-400">12 AY</span>
                </div>

                <div>
                    <p className="text-5xl font-black tracking-tighter bg-linear-to-r from-white via-green-100 to-green-500/50 bg-clip-text text-transparent">
                        {formatCurrency(totalExpenses * 12).replace(",00", "").replace("₺", "")}
                        <span className="text-2xl font-medium text-green-500/50 ml-1">₺</span>
                    </p>
                </div>
            </div>

            <Target className="absolute -bottom-8 -right-8 w-48 h-48 text-green-500/5 rotate-15 group-hover:scale-110 group-hover:rotate-[5deg] transition-transform duration-500 ease-out" />
        </BentoCard>
      </div>

      {/* grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* pasta grafik */}
        <BentoCard glowColor="zinc" className="p-6 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

          <div className="mb-4 flex justify-between items-start z-10">
             <div>
                 <h3 className="text-lg font-bold text-white mb-0.5">Kategori Dağılımı</h3>
                 <p className="text-[10px] text-zinc-500 font-medium">Harcamalarınızın sektörel analizi.</p>
             </div>
             <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                <Activity size={16} className="text-red-400" />
             </div>
          </div>
          
          <div className="relative w-full h-64 z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                    {categoryData.map((entry, index) => (
                        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1" key={index}>
                            <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1}/>
                            <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.6}/>
                        </linearGradient>
                    ))}
                </defs>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#gradient-${index})`} 
                        className="hover:opacity-80 transition-all duration-300 stroke-transparent outline-none" 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Toplam</span>
                <span className="text-2xl font-black text-white drop-shadow-2xl">{formatCurrency(totalExpenses).replace(",00", "").replace("₺", "")}</span>
            </div>
          </div>
          
          {/* kategori etiketleri */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 z-10">
              {categoryData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5 transition-colors cursor-default">
                      <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }} />
                      <span className="text-[10px] text-zinc-300 font-bold">{entry.name}</span>
                  </div>
              ))}
          </div>
        </BentoCard>

        {/* çubuk grafik */}
        <BentoCard glowColor="zinc" className="p-6 flex flex-col relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

           <div className="mb-4 flex justify-between items-start z-10">
             <div>
                <h3 className="text-lg font-bold text-white mb-0.5">Abonelik Maliyetleri</h3>
                <p className="text-[10px] text-zinc-500 font-medium">Servis bazlı ücret karşılaştırması.</p>
             </div>
             <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                <TrendingUp size={16} className="text-green-400" />
             </div>
          </div>
           
           <div className="w-full h-64 z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subscriptionData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                barSize={24} 
              >
                 <defs>
                    {subscriptionData.map((entry, index) => (
                        <linearGradient id={`barGradient-${index}`} x1="0" y1="0" x2="1" y2="0" key={index}>
                            <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.6}/>
                            <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1}/>
                        </linearGradient>
                    ))}
                </defs>

                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{fill: '#a1a1aa', fontSize: 11, fontWeight: 600 }}
                    axisLine={false} 
                    tickLine={false} 
                />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)', radius: 8 }} content={<CustomTooltip />} />
                <Bar dataKey="price" radius={[0, 6, 6, 0]} background={{ fill: 'rgba(255,255,255,0.02)', radius: [0, 6, 6, 0] }}>
                  {
                      subscriptionData.map((entry, index) => (
                        <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#barGradient-${index})`} 
                        className="hover:brightness-125 transition-all duration-300"
                        />
                      ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default SummaryChart;