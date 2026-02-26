import BentoCard from "../ui/BentoCard";
import { formatCurrency, cn } from "../../utils/helpers";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Target, Wallet, TrendingDown, Sparkles, Layers, Droplets } from "lucide-react";
import { useData } from "../../context/DataContext"; 
import { useUser } from "../../context/UserContext"; 
import { useUI } from "../../context/UIContext";

const COLORS = ['#f97316', '#06b6d4', '#84cc16', '#eab308', '#ec4899', '#8b5cf6'];


const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const SummaryChart = () => {

 
  const { subscriptions, totalExpenses } = useData();
  const { userSettings } = useUser();
  const { darkMode } = useUI();


  const monthlyLimit = parseInt(userSettings.budgetLimit) || 5000;

  const limitPercentage = Math.min((totalExpenses / monthlyLimit) * 100, 100);
  const remainingBudget = Math.max(monthlyLimit - totalExpenses, 0);

 
  let statusInfo = {
      text: "Durum Stabil",
      icon: Droplets
  };

  if (limitPercentage >= 100) {
      statusInfo = { text: "Limit Aşıldı!", icon: TrendingDown };
  } else if (limitPercentage > 80) {
      statusInfo = { text: "Dikkatli Ol", icon: Target };
  }

   // Abonelik yoksa gösterilecek placeholder
  if (subscriptions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-96 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-400">
            <Layers size={48} className="mb-4 opacity-30" />
            <p>Veri analizi için abonelik ekleyin.</p>
        </div>
    )
  }

  // kategori bazlı veri
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

// servis bazlı veri
  const subscriptionData = subscriptions
    .filter(sub => sub.status === 'active')
    .map(sub => ({ name: sub.name, price: parseFloat(sub.price) }))
    .sort((a, b) => b.price - a.price); 


  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={cn(
          "p-3 border shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl text-xs z-50 relative backdrop-blur-xl",
          darkMode
            ? "bg-zinc-800/95 border-zinc-700 text-zinc-100"
            : "bg-white/95 border-zinc-100 text-zinc-700"
        )}>
          <p className="font-bold mb-1">{payload[0].name}</p>
          
         
          <div className="flex items-center gap-2">
             <span className={darkMode ? "text-zinc-400 font-medium" : "text-zinc-500 font-medium"}>Fiyat:</span>
             <span className="font-black text-base">
                {formatCurrency(payload[0].value)}
             </span>
          </div>
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
        <BentoCard className="relative overflow-hidden p-6 bg-linear-to-br from-orange-500 to-amber-600 text-white shadow-xl  group hover:shadow-orange-300 duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] -mr-10 -mt-10 rounded-full group-hover:bg-white/20 transition-all" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 blur-[50px] -ml-10 -mb-10 rounded-full mix-blend-overlay" />
            
            {/* buyuk saydam ikon */}
            <Wallet className="absolute -right-9 top-0 w-28 h-28 text-orange-200 opacity-50  rotate-0 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-end mb-4">
                    <span className="text-xs font-bold text-white bg-orange-800/80 rounded-xl px-2 py-1 -mb-4 backdrop-blur-sm left-0 absolute">
                        Bu Ay
                    </span>
                </div>
                <div>
                    <p className="text-xl font-bold text-white mb-3 drop-shadow-sm  tracking-wide">Toplam Gider</p>
                    <h3 className="text-4xl font-black text-zinc-100/95 tracking-tight tabular-nums drop-shadow-md -mb-2">
                        {formatCurrency(totalExpenses)}
                    </h3>
                </div>
            </div>
        </BentoCard>


        {/* Kart limit kullanımı */}
        <BentoCard className="relative overflow-hidden p-6 bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20  group transition-all duration-500">

             {/* Arka Plan  */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
             <div className="absolute top-0 right-0 w-20 h-20 bg-teal-300/20 blur-[30px] rounded-full mix-blend-overlay" />

             {/* buyuk saydam ikon */}
             <statusInfo.icon className="absolute -left-10 -top-8 w-28 h-28 text-white opacity-30 -rotate-12 pointer-events-none" />

             <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-end mb-4">

                    {/* Status */}
                    <span className="text-xs font-bold px-2 py-1 rounded-xl bg-blue-800/60 backdrop-blur-md border-white/20 text-white">
                        {statusInfo.text}
                    </span>
                </div>

                <div className="w-full">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-xl font-bold text-white drop-shadow-sm tracking-wide">Limit Kullanımı</p>
                        <p className="text-xl text-white drop-shadow-md">{Math.round(limitPercentage)}%</p>
                    </div>
                    
                    {/* progress bar */}
                    <div className="h-3 w-full bg-black/50 rounded-full p-0.6 ">
                        <div 
                            className="h-full rounded-full bg-white shadow-[0_0_20px_7px_rgba(255,255,255,1)] relative transition-all duration-1000 ease-out"
                            style={{ width: `${limitPercentage}%` }}
                        >
                             {/* Işıltı efekti */}
                             <div className="absolute inset-0 bg-white/50 animate-ping rounded-full" />
                        </div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-[16px] font-bold text-white">
                        <span>0₺</span>
                        <span>{formatCurrency(monthlyLimit)}</span>
                    </div>
                </div>
             </div>
        </BentoCard>


         {/* Kalan Bütçe */}
        <BentoCard className="relative overflow-hidden p-6 bg-linear-to-br to-lime-500 from-emerald-800 text-white shadow-xl shadow-lime-500/20 border border-lime-300/50">
             <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300/30 blur-[70px] rounded-full mix-blend-overlay" />
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-100/20 blur-[50px] rounded-full mix-blend-overlay" />
            

             {/* buyuk saydam ikon */}
             <Activity className="absolute -right-11 -top-3 w-45 h-40 text-white opacity-30 -rotate-12 pointer-events-none" />

             <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-end mb-4 mr-62">
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm", remainingBudget > 0 ? "bg-green-900 text-white" : "bg-red-500/40 border-red-200/40 text-white")}>
                         {remainingBudget > 0 ? "Güvendesin" : "Eksi Bakiye"} 
                    </div>
                </div>
                
                <div>
                    <p className="text-xm font-bold text-white mb-4 drop-shadow-sm tracking-wider">Kalan Bütçe</p>
                    <h3 className="text-4xl font-black text-white tracking-tight tabular-nums drop-shadow-md">
                        {formatCurrency(remainingBudget)}
                    </h3>
                </div>
             </div>
        </BentoCard>

      </div>

      {/* grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BentoCard className="p-6 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-[0_2px_15px_rgb(0,0,0,0.03)] min-h-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-lime-500 rounded-full mr-1 shadow-sm"></span>
                Kategori Dağılımı
            </h3>
            
            <div className="flex-1 w-full min-h-75 mt-4 relative isolate"> 
               
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                     <span className="text-slate-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Toplam</span>
                     <span className="text-slate-800 dark:text-zinc-100 text-2xl font-black">{formatCurrency(totalExpenses)}</span>
                </div>

                {/* Grafik  */}
                <div className="absolute inset-0 z-10">
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
                                        className="hover:opacity-80 transition-all duration-300 outline-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)] cursor-pointer"
                                    />
                                ))}
                            </Pie>
                           
                            <Tooltip 
                                content={<CustomTooltip />} 
                                wrapperStyle={{ zIndex: 100 }} 
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 relative z-20">
                {categoryData.slice(0, 5).map((entry, index) => {
                    const color = COLORS[index % COLORS.length];
                    return (
                        <div 
                            key={index} 
                            className="flex items-center gap-2 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors duration-300 shadow-sm"
                            style={{ 
                                backgroundColor: color, 
                                borderColor: color,      
                                color: '#ffffff'        
                            }}
                        >
                            <span className="w-2 h-2 rounded-full shadow-sm bg-white" />
                            {entry.name}
                        </div>
                    );
                })}
            </div>
          </BentoCard>

          <BentoCard className="p-6 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-[0_2px_15px_rgb(0,0,0,0.03)] min-h-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
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
                    tick={{ fill: darkMode ? '#a1a1aa' : '#64748b', fontSize: 12, fontWeight: 700 }}
                    axisLine={false} 
                    tickLine={false} 
                />
                
                <Tooltip cursor={{ fill: darkMode ? 'rgba(39,39,42,0.6)' : 'rgba(241, 245, 249, 0.6)', radius: 8 }} content={<CustomTooltip />} />
                <Bar 
                  dataKey="price" 
                  name="Fiyat" 
                  radius={[0, 8, 8, 0]} 
                  background={{ fill: darkMode ? '#27272a' : '#f8fafc', radius: [0, 8, 8, 0] }}
                >
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