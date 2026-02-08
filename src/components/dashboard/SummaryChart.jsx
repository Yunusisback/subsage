import BentoCard from "../ui/BentoCard";
import { formatCurrency, cn } from "../../utils/helpers";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Target, Wallet, TrendingDown, Sparkles, Layers,  Droplets } from "lucide-react";
import { useData } from "../../context/DataContext"; 
import { useUser } from "../../context/UserContext"; 

const COLORS = ['#f97316', '#06b6d4', '#84cc16', '#eab308', '#ec4899', '#8b5cf6'];

const SummaryChart = () => {

 
  const { subscriptions, totalExpenses } = useData();
  const { userSettings } = useUser();

  // Aylık Bütçe Limiti
  const monthlyLimit = parseInt(userSettings.budgetLimit) || 5000;
  
    // Limit Yüzdesi ve Kalan Bütçe
  const limitPercentage = Math.min((totalExpenses / monthlyLimit) * 100, 100);
  const remainingBudget = Math.max(monthlyLimit - totalExpenses, 0);

  // Limit Durum Metinleri 
  let statusInfo = {
      text: "Durum Stabil",
      icon: Droplets
  };

  if (limitPercentage >= 100) {
      statusInfo = { text: "Limit Aşıldı!", icon: TrendingDown };
  } else if (limitPercentage > 80) {
      statusInfo = { text: "Dikkatli Ol", icon: Target };
  }

  // Veri Hazırlama
  if (subscriptions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-96 border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 text-zinc-400">
            <Layers size={48} className="mb-4 opacity-30" />
            <p>Veri analizi için abonelik ekleyin.</p>
        </div>
    )
  }
  // Kategori Verisi hazırlama
  const categoryData = subscriptions.reduce((acc, sub) => {
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

// Servis Bazlı Veri 
  const subscriptionData = subscriptions
    .filter(sub => sub.status === 'active')
    .map(sub => ({ name: sub.name, price: parseFloat(sub.price) }))
    .sort((a, b) => b.price - a.price); 

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl p-3 border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl text-xs">
          <p className="font-bold text-zinc-700 mb-1">{payload[0].name}</p>
          <p className="font-black text-base text-zinc-900">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
      {/* üst kısım */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
         {/* Toplam gider */}
        <BentoCard className="relative overflow-hidden p-6 bg-linear-to-br from-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/20 border border-orange-400/50 group hover:shadow-orange-500/40 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] -mr-10 -mt-10 rounded-full group-hover:bg-white/20 transition-all" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 blur-[50px] -ml-10 -mb-10 rounded-full mix-blend-overlay" />
            
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white/20 rounded-lg text-white backdrop-blur-sm border border-white/20">
                        <Wallet size={20} />
                    </div>
                    <span className="text-xs font-bold text-white bg-white/20 px-2 py-1 rounded-md border border-white/20 backdrop-blur-sm">
                        Bu Ay
                    </span>
                </div>
                <div>
                    <p className="text-sm font-bold text-orange-100 mb-1 drop-shadow-sm">Toplam Gider</p>
                    <h3 className="text-4xl font-black text-white tracking-tight tabular-nums drop-shadow-md">
                        {formatCurrency(totalExpenses)}
                    </h3>
                </div>
            </div>
        </BentoCard>


        {/* Kart limit kullanımı */}
        <BentoCard className="relative overflow-hidden p-6 bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 border border-cyan-400/50 group transition-all duration-500">

             {/* Arka Plan  */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
             <div className="absolute top-0 right-0 w-20 h-20 bg-teal-300/20 blur-[30px] rounded-full mix-blend-overlay" />

             <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                     <div className="p-2 rounded-lg bg-white/20 backdrop-blur-md shadow-inner text-white border border-white/20">
                        <statusInfo.icon size={20} />
                    </div>
                    {/* Status */}
                    <span className="text-xs font-bold px-2 py-1 rounded-md border bg-white/20 backdrop-blur-md border-white/20 text-white">
                        {statusInfo.text}
                    </span>
                </div>

                <div className="w-full">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-sm font-bold text-cyan-100 drop-shadow-sm">Limit Kullanımı</p>
                        <p className="text-lg font-black text-white drop-shadow-md">{Math.round(limitPercentage)}%</p>
                    </div>
                    
                    {/* progress bar */}
                    <div className="h-3 w-full bg-black/20 rounded-full p-0.5 border border-white/10">
                        <div 
                            className="h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] relative transition-all duration-1000 ease-out"
                            style={{ width: `${limitPercentage}%` }}
                        >
                             {/* Işıltı efekti */}
                             <div className="absolute inset-0 bg-white/50 animate-pulse" />
                        </div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-cyan-100/70">
                        <span>0₺</span>
                        <span>{formatCurrency(monthlyLimit)}</span>
                    </div>
                </div>
             </div>
        </BentoCard>


         {/* Kalan Bütçe */}
        <BentoCard className="relative overflow-hidden p-6 bg-linear-to-br from-lime-400 to-emerald-500 text-white shadow-xl shadow-lime-500/20 border border-lime-300/50">
             <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300/30 blur-[70px] rounded-full mix-blend-overlay" />
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-100/20 blur-[50px] rounded-full mix-blend-overlay" />
             <Sparkles className="absolute top-4 right-4 text-lime-100 opacity-50" size={24} />

             <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white/20 rounded-lg text-white border border-white/20 backdrop-blur-sm shadow-inner">
                        <Activity size={20} />
                    </div>
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm", remainingBudget > 0 ? "bg-white/20 border-white/20 text-white" : "bg-red-500/40 border-red-200/40 text-white")}>
                         {remainingBudget > 0 ? "Güvendesin" : "Eksi Bakiye"}
                    </div>
                </div>
                
                <div>
                    <p className="text-sm font-bold text-lime-100 mb-1 drop-shadow-sm">Kalan Bütçe</p>
                    <h3 className="text-4xl font-black text-white tracking-tight tabular-nums drop-shadow-md">
                        {formatCurrency(remainingBudget)}
                    </h3>
                </div>
             </div>
        </BentoCard>

      </div>

      {/* grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BentoCard className="p-6 bg-white border border-zinc-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] min-h-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-lime-500 rounded-full mr-1 shadow-sm"></span>
                Kategori Dağılımı
            </h3>
            
            <div className="flex-1 w-full min-h-75 mt-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={115}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-all duration-300 outline-none  filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Toplam</span>
                     <span className="text-slate-800 text-2xl font-black">{formatCurrency(totalExpenses)}</span>
                </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                {categoryData.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        {entry.name}
                    </div>
                ))}
            </div>
          </BentoCard>

          <BentoCard className="p-6 bg-white border border-zinc-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] min-h-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-500 rounded-full mr-1 shadow-sm"></span>
                Hizmet Maliyetleri
            </h3>
            <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subscriptionData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 40, bottom: 0 }}
                barSize={24}
              >
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    axisLine={false} 
                    tickLine={false} 
                />
                <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.6)', radius: 8 }} content={<CustomTooltip />} />
                <Bar dataKey="price" radius={[0, 8, 8, 0]} background={{ fill: '#f8fafc', radius: [0, 8, 8, 0] }}>
                  {
                      subscriptionData.map((entry, index) => (
                        <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        className="hover:opacity-85 transition-all duration-300 "
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