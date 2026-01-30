import { useGlobal } from "../../context/GlobalContext";
import BentoCard from "../ui/BentoCard";
import { formatCurrency, cn } from "../../utils/helpers";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, PiggyBank, Activity, Target,  Wallet } from "lucide-react";

const COLORS = ['#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#f87171'];

const SummaryChart = () => {

  const { subscriptions, totalExpenses, userSettings } = useGlobal();

  // Aylık Bütçe Limiti
  const monthlyLimit = parseInt(userSettings.budgetLimit) || 5000;
  
  // Yüzde Hesabı
  const limitPercentage = Math.min((totalExpenses / monthlyLimit) * 100, 100);
  const remainingBudget = Math.max(monthlyLimit - totalExpenses, 0);

  // Limit Durumuna Göre Renk ve Mesaj
  let statusColor = "bg-emerald-500";
  let statusText = "Bütçe kontrol altında";
  let statusBg = "bg-emerald-50 text-emerald-700 border-emerald-100";

  if (limitPercentage >= 100) {
      statusColor = "bg-red-500";
      statusText = "Bütçe aşıldı!";
      statusBg = "bg-red-50 text-red-700 border-red-100";
  } else if (limitPercentage > 80) {
      statusColor = "bg-amber-500";
      statusText = "Limire yaklaştınız";
      statusBg = "bg-amber-50 text-amber-700 border-amber-100";
  }

  if (subscriptions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50 text-zinc-400">
            <Activity size={48} className="mb-4 opacity-50" />
            <p>Raporları görmek için önce abonelik eklemelisiniz.</p>
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
    .map(sub => ({
        name: sub.name,
        price: parseFloat(sub.price)
    }))
    .sort((a, b) => b.price - a.price); 

 
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-zinc-100 shadow-xl rounded-xl text-xs">
          <p className="font-bold text-zinc-900 mb-1">{payload[0].name}</p>
          <p className="font-semibold text-zinc-500">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Üst Kısım Bütçe Özeti */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Sol Toplam Harcama */}
        <BentoCard glowColor="blue" className="p-5 lg:p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-zinc-500 mb-1">Toplam Aylık Gider</p>
                    <h3 className="text-2xl lg:text-3xl font-black text-zinc-900 tracking-tight">{formatCurrency(totalExpenses)}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <TrendingUp size={20} className="lg:w-6 lg:h-6" />
                </div>
            </div>
            <div className="mt-4">
                 <p className="text-xs text-zinc-400">Geçen aya göre <span className="text-emerald-500 font-bold">%12 artış</span> var.</p>
            </div>
        </BentoCard>

        {/* Orta Bütçe Durumu */}
        <BentoCard glowColor="zinc" className="p-5 lg:p-6 flex flex-col justify-center">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs lg:text-sm font-bold text-zinc-700 flex items-center gap-2">
                    <Target size={16} /> Bütçe Hedefi
                </span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border", statusBg)}>
                    {statusText}
                </span>
             </div>
             
             <div className="flex items-end gap-1 mb-3">
                 <span className="text-xl lg:text-2xl font-bold text-zinc-900">{Math.round(limitPercentage)}%</span>
                 <span className="text-xs font-semibold text-zinc-400 mb-1.5">kullanıldı</span>
             </div>

             <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                 <div 
                    className={cn("h-full transition-all duration-1000 ease-out rounded-full", statusColor)} 
                    style={{ width: `${limitPercentage}%` }}
                 />
             </div>
             
             <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-400">
                 <span>0₺</span>
                 <span>{formatCurrency(monthlyLimit)}</span>
             </div>
        </BentoCard>

        {/* Sağ Kalan Bütçe */}
        <BentoCard glowColor="green" className="p-5 lg:p-6 flex flex-col justify-between">
             <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-zinc-500 mb-1">Kalan Bütçe</p>
                    <h3 className={cn("text-2xl lg:text-3xl font-black tracking-tight", remainingBudget === 0 ? "text-red-500" : "text-emerald-600")}>
                        {formatCurrency(remainingBudget)}
                    </h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <PiggyBank size={20} className="lg:w-6 lg:h-6" />
                </div>
            </div>
            <div className="mt-4">
                 {remainingBudget > 0 ? (
                    <p className="text-xs text-zinc-400">Harcayabileceğiniz <span className="text-zinc-900 font-bold">{formatCurrency(remainingBudget)}</span> daha var.</p>
                 ) : (
                    <p className="text-xs text-red-400 font-bold">Limitlerinizi aştınız, dikkatli olun!</p>
                 )}
            </div>
        </BentoCard>
      </div>

      {/* Alt Kısım Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Kategoriler Pasta Grafik  */}
          <BentoCard glowColor="zinc" className="p-5 lg:p-6 min-h-100">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Activity size={20} className="text-zinc-400" />
                Kategori Dağılımı
            </h3>
            <div className="h-56 lg:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
           {/* açıklama */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {categoryData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {entry.name} ({Math.round((entry.value / totalExpenses) * 100)}%)
                    </div>
                ))}
            </div>
          </BentoCard>

          {/* Servis Bazlı Maliyet */}
          <BentoCard glowColor="zinc" className="p-5 lg:p-6 min-h-100">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Wallet size={20} className="text-zinc-400" />
                Servis Bazlı Maliyetler
            </h3>
            <div className="h-64 lg:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subscriptionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                 <defs>
                    {subscriptionData.map((entry, index) => (
                        <linearGradient id={`barGradient-${index}`} x1="0" y1="0" x2="1" y2="0" key={index}>
                            <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.7}/>
                            <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1}/>
                        </linearGradient>
                    ))}
                </defs>

                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80} 
                    tick={{fill: '#71717a', fontSize: 10, fontWeight: 600 }}
                    axisLine={false} 
                    tickLine={false} 
                />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)', radius: 8 }} content={<CustomTooltip />} />
                <Bar dataKey="price" radius={[0, 6, 6, 0]} background={{ fill: 'rgba(0,0,0,0.02)', radius: [0, 6, 6, 0] }}>
                  {
                      subscriptionData.map((entry, index) => (
                        <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#barGradient-${index})`} 
                        className="hover:brightness-110 transition-all duration-300"
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