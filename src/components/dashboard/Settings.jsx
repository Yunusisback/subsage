import { useState } from "react";
import { User, Globe, Bell, Shield, Moon, Sun, Monitor, Save, CreditCard, Mail, Lock, Smartphone } from "lucide-react";
import BentoCard from "../ui/BentoCard";
import Button from "../ui/Button";
import { cn } from "../../utils/helpers";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  
  // örnek stateler
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: false,
    paymentAlert: true
  });

  const [theme, setTheme] = useState("dark"); 

  const handleSave = () => {
    setLoading(true);
   
    setTimeout(() => {
        setLoading(false);
    }, 1500);
  };

  const Toggle = ({ active, onClick }) => (
    <button 
        onClick={onClick}
        className={cn(
            "w-11 h-6 rounded-full p-1 transition-colors duration-300 flex items-center cursor-pointer",
            active ? "bg-yellow-500" : "bg-zinc-700"
        )}
    >
        <div className={cn(
            "w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300",
            active ? "translate-x-5" : "translate-x-0"
        )} />
    </button>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-5xl mx-auto">
        
        {/* başlık ve kaydet butonu */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
       
            <Button 
                variant="primary" 
                onClick={handleSave} 
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                        Kaydediliyor...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Save size={18} />
                        Değişiklikleri Kaydet
                    </span>
                )}
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* profil ayarları */}
            <BentoCard glowColor="zinc" className="md:col-span-2 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                        <User size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Profil Bilgileri</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* avatar değiştirme */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-zinc-700 p-1 cursor-pointer hover:border-yellow-500 transition-colors group relative overflow-hidden">
                            <img 
                                src="https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkNTM1NTYuanBlZw==" 
                                alt="Profil" 
                                className="w-full h-full object-cover rounded-full" 
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-white font-bold uppercase">Değiştir</span>
                            </div>
                        </div>
                        <span className="text-xs text-zinc-500">JPG, PNG (Max 2MB)</span>
                    </div>

                    {/* form alanları */}
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-400 ml-1">Ad Soyad</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input type="text" defaultValue="Burak Y." className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-yellow-500/50 focus:outline-none transition-colors" />
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-400 ml-1">E-posta</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input type="email" defaultValue="burak@example.com" className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-yellow-500/50 focus:outline-none transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                             <label className="text-xs font-bold text-zinc-400 ml-1">Biyografi</label>
                             <textarea rows="3" className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:border-yellow-500/50 focus:outline-none transition-colors resize-none" placeholder="Kendinizden kısaca bahsedin..."></textarea>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* genel tercihler */}
            <BentoCard glowColor="zinc" className="p-8 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                        <Globe size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Bölge ve Dil</h3>
                </div>

                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-400 ml-1">Uygulama Dili</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:border-purple-500/50 focus:outline-none transition-colors appearance-none cursor-pointer">
                            <option value="tr">Türkçe</option>
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-400 ml-1">Para Birimi</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:border-purple-500/50 focus:outline-none transition-colors appearance-none cursor-pointer">
                            <option value="try">Türk Lirası (₺)</option>
                            <option value="usd">Amerikan Doları ($)</option>
                            <option value="eur">Euro (€)</option>
                        </select>
                    </div>
                    
                    <div className="pt-2">
                        <label className="text-xs font-bold text-zinc-400 ml-1 mb-2 block">Tema</label>
                        <div className="grid grid-cols-3 gap-2 bg-black/20 p-1 rounded-xl border border-white/5">
                            <button 
                                onClick={() => setTheme("light")}
                                className={cn("flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer", theme === "light" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white")}
                            >
                                <Sun size={16} />
                                Açık
                            </button>
                            <button 
                                onClick={() => setTheme("dark")}
                                className={cn("flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer", theme === "dark" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-white")}
                            >
                                <Moon size={16} />
                                Koyu
                            </button>
                            <button 
                                onClick={() => setTheme("system")}
                                className={cn("flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer", theme === "system" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-white")}
                            >
                                <Monitor size={16} />
                                Sistem
                            </button>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* bildirimler */}
            <BentoCard glowColor="zinc" className="p-8 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
                        <Bell size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Bildirimler</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-zinc-400" />
                            <div>
                                <p className="text-sm font-bold text-white">E-posta Bildirimleri</p>
                                <p className="text-[10px] text-zinc-500">Kampanyalar ve güncellemeler.</p>
                            </div>
                        </div>
                        <Toggle active={notifications.email} onClick={() => setNotifications(prev => ({...prev, email: !prev.email}))} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <Smartphone size={18} className="text-zinc-400" />
                            <div>
                                <p className="text-sm font-bold text-white">Anlık Bildirimler</p>
                                <p className="text-[10px] text-zinc-500">Uygulama içi uyarılar.</p>
                            </div>
                        </div>
                        <Toggle active={notifications.push} onClick={() => setNotifications(prev => ({...prev, push: !prev.push}))} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <CreditCard size={18} className="text-zinc-400" />
                            <div>
                                <p className="text-sm font-bold text-white">Ödeme Uyarıları</p>
                                <p className="text-[10px] text-zinc-500">Yaklaşan ödemeler hatırlatılır.</p>
                            </div>
                        </div>
                        <Toggle active={notifications.paymentAlert} onClick={() => setNotifications(prev => ({...prev, paymentAlert: !prev.paymentAlert}))} />
                    </div>
                </div>
            </BentoCard>

            {/* güvenlik */}
            <BentoCard glowColor="zinc" className="md:col-span-2 p-8">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-green-500/20 text-green-400">
                        <Shield size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Güvenlik</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h4 className="text-sm font-bold text-white mb-2">Şifre Değiştir</h4>
                        <p className="text-xs text-zinc-400 mb-4">Hesabınızın güvenliği için güçlü bir şifre kullanın. Son değişiklik: 3 ay önce.</p>
                        <Button variant="outline" size="sm" className="w-full md:w-auto cursor-pointer">
                            <Lock size={16} className="mr-2" />
                            Şifre Yenile
                        </Button>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-between mb-2">
                             <h4 className="text-sm font-bold text-white">İki Faktörlü Doğrulama (2FA)</h4>
                             <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold">AKTİF</span>
                        </div>
                        <p className="text-xs text-zinc-400 mb-4">Giriş yaparken telefonunuza gönderilen kodu girmeniz gerekir.</p>
                        <Button variant="danger" size="sm" className="w-full md:w-auto opacity-80 hover:opacity-100 cursor-pointer">
                           Devre Dışı Bırak
                        </Button>
                    </div>
                </div>
            </BentoCard>

        </div>
    </div>
  );
};

export default Settings;