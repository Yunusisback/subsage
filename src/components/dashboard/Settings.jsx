import { useState, useEffect, useRef } from "react";
import { User, Earth, Bell, ShieldUser, Save, CreditCard, Mail, Lock, Smartphone, Wallet, ChevronDown, Check } from "lucide-react";
import BentoCard from "../ui/BentoCard";
import Button from "../ui/Button";
import { cn } from "../../utils/helpers";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext"; 


const CustomSelect = ({ options, value, onChange, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedLabel = options.find(opt => opt.value === value)?.label || value;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full border rounded-xl py-2.5 px-4 text-sm flex items-center justify-between cursor-pointer transition-all duration-200 select-none",
                    "bg-white dark:bg-zinc-800/80",
                    isOpen 
                        ? "border-cyan-400 dark:border-cyan-600 ring-4 ring-cyan-50/80 dark:ring-cyan-900/20" 
                        : "border-zinc-200 dark:border-zinc-700/80 hover:border-cyan-400 dark:hover:border-cyan-600"
                )}
            >
                <span className="text-zinc-900 dark:text-zinc-100 font-medium flex items-center gap-2">
                    {selectedLabel}
                </span>
                <ChevronDown size={16} className={cn(
                    "text-zinc-400 dark:text-zinc-500 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </div>

            {isOpen && (
                <div className={cn(
                    "absolute z-50 w-full mt-1 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border",
                    "bg-white dark:bg-zinc-800",
                    "border-zinc-100 dark:border-zinc-700/80",
                    "dark:shadow-black/50"
                )}>
                    <ul className="py-1">
                        {options.map((option) => (
                            <li 
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors",
                                    value === option.value 
                                        ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-semibold" 
                                        : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 hover:text-cyan-600 dark:hover:text-cyan-400" 
                                )}
                            >
                                {option.label}
                                {value === option.value && <Check size={14} className="text-cyan-500 dark:text-cyan-400" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


const Settings = () => {
  const { userSettings, updateUserSettings } = useUser(); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(userSettings);

  useEffect(() => {
    setFormData(prev => ({
        ...userSettings,
        budgetLimit: userSettings.budgetLimit || 5000 
    }));
  }, [userSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key) => {
      setFormData(prev => ({
          ...prev,
          notificationPreferences: {
              ...prev.notificationPreferences,
              [key]: !prev.notificationPreferences[key]
          }
      }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
        updateUserSettings(formData);
        setLoading(false);
        toast.success("Ayarlar başarıyla kaydedildi!");
    }, 1000);
  };

  const inputClass = cn(
      "w-full border rounded-xl py-3 pl-10 pr-4 text-sm transition-all",
      "bg-white dark:bg-zinc-800/80",
      "border-zinc-200 dark:border-zinc-700/80",
      "text-zinc-900 dark:text-zinc-100",
      "focus:border-cyan-500 dark:focus:border-cyan-600",
      "focus:ring-4 focus:ring-cyan-50/80 dark:focus:ring-cyan-900/20",
      "focus:outline-none",
      "placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
  );

  const Toggle = ({ active, onClick }) => (
    <button 
        onClick={onClick}
        className={cn(
            "w-11 h-6 rounded-full p-1 transition-all duration-300 flex items-center cursor-pointer border",
            active 
                ? "bg-cyan-500 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.25)]" 
                : "bg-zinc-200 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600"
        )}
    >
        <div className={cn(
            "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
            active ? "translate-x-5" : "translate-x-0"
        )} />
    </button>
  );

  const notifRowClass = cn(
      "flex items-center justify-between p-4 rounded-xl border transition-colors duration-200",
      "bg-zinc-50/60 dark:bg-zinc-800/40",
      "border-zinc-100 dark:border-zinc-700/50",
      "hover:border-zinc-200 dark:hover:border-zinc-600/60"
  );

  const languageOptions = [
      { value: "tr", label: "Türkçe" },
      { value: "en", label: "English" },
      { value: "de", label: "Deutsch" }
  ];

  const currencyOptions = [
      { value: "TRY", label: "TRY (₺)" },
      { value: "USD", label: "USD ($)" },
      { value: "EUR", label: "EUR (€)" }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-5xl mx-auto">
        
        {/* başlık ve kaydet butonu */}
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
            <Button 
                variant="primary" 
                onClick={handleSave} 
                className={cn(
                    "font-bold px-8 rounded-2xl active:scale-95 transition-all duration-200 cursor-pointer",
                    "bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600",
                    "text-white",
                    "shadow-lg shadow-cyan-500/20 dark:shadow-cyan-950/30",
                    "border-transparent"
                )}
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
            <BentoCard glowColor="cyan" className="md:col-span-2 p-8 items-start text-left">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-500/20">
                        <User size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Profil Bilgileri</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start w-full">
                    {/* avatar değiştirme */}
                    <div className="flex flex-col items-center gap-3">
                        <div className={cn(
                            "w-24 h-24 rounded-full border-2 border-dashed p-1 cursor-pointer transition-all group relative overflow-hidden",
                            "border-zinc-200 dark:border-zinc-700",
                            "hover:border-cyan-500 dark:hover:border-cyan-500"
                        )}>
                            <img 
                                src={formData.avatar} 
                                alt="Profil" 
                                className="w-full h-full object-cover rounded-full bg-zinc-100 dark:bg-zinc-800" 
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Değiştir</span>
                            </div>
                        </div>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">JPG, PNG (Max 2MB)</span>
                    </div>

                    {/* form alanları */}
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Ad Soyad</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">E-posta</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* bölge ve bütçe ayarları */}
            <BentoCard glowColor="cyan" className="p-8 flex flex-col h-full items-start text-left overflow-visible">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-500/20">
                        <Earth size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Bölge ve Bütçe</h3>
                </div>

                <div className="space-y-6 w-full">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 z-20 relative">
                            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Uygulama Dili</label>
                            <CustomSelect 
                                options={languageOptions}
                                value={formData.language}
                                onChange={(val) => handleSelectChange('language', val)}
                            />
                        </div>

                        <div className="space-y-2 z-20 relative">
                            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Para Birimi</label>
                            <CustomSelect 
                                options={currencyOptions}
                                value={formData.currency}
                                onChange={(val) => handleSelectChange('currency', val)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 z-10">
                        <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Aylık Bütçe Hedefi</label>
                        <div className="relative">
                            <Wallet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input 
                                type="number" 
                                name="budgetLimit"
                                value={formData.budgetLimit}
                                onChange={handleChange}
                                placeholder="5000"
                                className={cn(
                                    inputClass,
                                    "pr-8",
                                    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                )}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600 dark:text-cyan-400">₺</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-1 leading-relaxed">Raporlar sayfasındaki harcama limiti grafiği için kullanılır.</p>
                    </div>
                </div>
            </BentoCard>

            {/* bildirimler */}
            <BentoCard glowColor="cyan" className="p-8 flex flex-col h-full items-start text-left">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20">
                        <Bell size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Bildirimler</h3>
                </div>

                <div className="space-y-3 w-full">
                    <div className={notifRowClass}>
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">E-posta Bildirimleri</p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Kampanyalar ve güncellemeler.</p>
                            </div>
                        </div>
                        <Toggle 
                            active={formData.notificationPreferences.email} 
                            onClick={() => handleToggle('email')} 
                        />
                    </div>

                    <div className={notifRowClass}>
                        <div className="flex items-center gap-3">
                            <Smartphone size={18} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Anlık Bildirimler</p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Uygulama içi uyarılar.</p>
                            </div>
                        </div>
                        <Toggle 
                            active={formData.notificationPreferences.push} 
                            onClick={() => handleToggle('push')} 
                        />
                    </div>

                    <div className={notifRowClass}>
                        <div className="flex items-center gap-3">
                            <CreditCard size={18} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Ödeme Uyarıları</p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Yaklaşan ödemeler hatırlatılır.</p>
                            </div>
                        </div>
                        <Toggle 
                            active={formData.notificationPreferences.paymentAlert} 
                            onClick={() => handleToggle('paymentAlert')} 
                        />
                    </div>
                </div>
            </BentoCard>

            {/* güvenlik */}
            <BentoCard glowColor="cyan" className="md:col-span-2 p-8 items-start text-left">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                        <ShieldUser size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Güvenlik</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
                    <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">Şifre Değiştir</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">Hesabınızın güvenliği için güçlü bir şifre kullanın. Son değişiklik: 3 ay önce.</p>
                      
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn(
                                "w-full md:w-auto cursor-pointer rounded-xl px-5",
                                "border-zinc-200 dark:border-zinc-700",
                                "text-zinc-600 dark:text-zinc-300",
                                "hover:text-cyan-600 dark:hover:text-cyan-400",
                                "hover:bg-cyan-50 dark:hover:bg-cyan-900/20",
                                "hover:border-cyan-300 dark:hover:border-cyan-700"
                            )}
                        >
                            <Lock size={16} className="mr-2" />
                            Şifre Yenile
                        </Button>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 pt-8 md:pt-0 md:pl-8">
                        <div className="flex items-center justify-between mb-2">
                             <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">İki Faktörlü Doğrulama (2FA)</h4>
                             <span className={cn(
                                 "text-[10px] font-bold px-2 py-0.5 rounded-lg border tracking-wider",
                                 "bg-emerald-100 dark:bg-emerald-500/15",
                                 "text-emerald-600 dark:text-emerald-400",
                                 "border-emerald-200 dark:border-emerald-500/20"
                             )}>AKTİF</span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">Giriş yaparken telefonunuza gönderilen kodu girmeniz gerekir.</p>
                        <Button variant="danger" size="sm" className="w-full md:w-auto opacity-100 cursor-pointer rounded-xl px-5">
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