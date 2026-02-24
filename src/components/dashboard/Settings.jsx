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
                    "w-full bg-white border rounded-xl py-2.5 px-4 text-sm flex items-center justify-between cursor-pointer transition-all duration-200 select-none",
                    isOpen ? "border-purple-100 ring-2 ring-purple-100" : "border-zinc-200 hover:border-purple-300"
                )}
            >
                <span className="text-zinc-900 font-medium flex items-center gap-2">
              
                    {selectedLabel}
                </span>
                <ChevronDown size={16} className={cn("text-zinc-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </div>

         
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-100 rounded-xl shadow-lg shadow-zinc-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                                        ? "bg-cyan-50 text-cyan-700 font-semibold" 
                                        : "text-zinc-600 hover:bg-cyan-50/50 hover:text-cyan-600" 
                                )}
                            >
                                {option.label}
                                {value === option.value && <Check size={14} className="text-cyan-500" />}
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
  
  // Form verilerini Contextten gelen verilerle başlatıyoruz
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

        // Global Context i güncelle
        updateUserSettings(formData);
        setLoading(false);
        toast.success("Ayarlar başarıyla kaydedildi!");
    }, 1000);
  };

  const Toggle = ({ active, onClick }) => (
    <button 
        onClick={onClick}
        className={cn(
            "w-11 h-6 rounded-full p-1 transition-colors duration-300 flex items-center cursor-pointer border",
            active ? "bg-cyan-400 border-cyan-400" : "bg-zinc-200 border-zinc-200"
        )}
    >
        <div className={cn(
            "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
            active ? "translate-x-5" : "translate-x-0"
        )} />
    </button>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
       
            <Button 
                variant="primary" 
                onClick={handleSave} 
                className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold px-6 shadow-sm cursor-pointer rounded-3xl active:scale-95 transition-all duration-200"
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
            <BentoCard glowColor="zinc" className="md:col-span-2 p-8 items-start text-left">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                        <User size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">Profil Bilgileri</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start w-full">
                    
                    {/* avatar değiştirme */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-zinc-300 p-1 cursor-pointer hover:border-cyan-500 transition-colors group relative overflow-hidden">
                            <img 
                                src={formData.avatar} 
                                alt="Profil" 
                                className="w-full h-full object-cover rounded-full" 
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <span className="text-[10px] text-white font-bold uppercase">Değiştir</span>
                            </div>
                        </div>
                        <span className="text-xs text-zinc-500">JPG, PNG (Max 2MB)</span>
                    </div>

                    {/* form alanları */}
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 ml-1">Ad Soyad</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:border-cyan-500 focus:outline-none transition-colors" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 ml-1">E-posta</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:border-cyan-500 focus:outline-none transition-colors" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* bölge ve bütçe ayarları */}
            <BentoCard glowColor="zinc" className="p-8 flex flex-col h-full items-start text-left overflow-visible">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 ">
                        <Earth size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">Bölge ve Bütçe</h3>
                </div>

                <div className="space-y-5 w-full">
                    <div className="grid grid-cols-2 gap-4">
                        
                       
                        <div className="space-y-1.5 z-20 relative">
                            <label className="text-xs font-bold text-zinc-500 ml-1">Uygulama Dili</label>
                            <CustomSelect 
                                options={languageOptions}
                                value={formData.language}
                                onChange={(val) => handleSelectChange('language', val)}
                            />
                        </div>

                        <div className="space-y-1.5 z-20 relative">
                            <label className="text-xs font-bold text-zinc-500 ml-1">Para Birimi</label>
                            <CustomSelect 
                                options={currencyOptions}
                                value={formData.currency}
                                onChange={(val) => handleSelectChange('currency', val)}
                            />
                        </div>
                    </div>

                     {/*  aylık bütçe hedefi */}
                    <div className="space-y-1.5 z-10">
                        <label className="text-xs font-bold text-zinc-500 ml-1">Aylık Bütçe Hedefi</label>
                        <div className="relative">
                            <Wallet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input 
                                type="number" 
                                name="budgetLimit"
                                value={formData.budgetLimit || 5000}
                                onChange={handleChange}
                                placeholder="5000"
                            
                                className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:border-purple-500 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">₺</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 ml-1">Raporlar sayfasındaki harcama limiti grafiği için kullanılır.</p>
                    </div>
                </div>
            </BentoCard>

            {/* bildirimler */}
            <BentoCard glowColor="zinc" className="p-8 flex flex-col h-full items-start text-left">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 ">
                        <Bell size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">Bildirimler</h3>
                </div>

                <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                        <div className="flex items-center gap-3">
                            <Mail size={18} className="text-zinc-500" />
                            <div>
                                <p className="text-sm font-bold text-zinc-900">E-posta Bildirimleri</p>
                                <p className="text-[10px] text-zinc-500">Kampanyalar ve güncellemeler.</p>
                            </div>
                        </div>
                        <Toggle 
                            active={formData.notificationPreferences.email} 
                            onClick={() => handleToggle('email')} 
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                        <div className="flex items-center gap-3">
                            <Smartphone size={18} className="text-zinc-500" />
                            <div>
                                <p className="text-sm font-bold text-zinc-900">Anlık Bildirimler</p>
                                <p className="text-[10px] text-zinc-500">Uygulama içi uyarılar.</p>
                            </div>
                        </div>
                        <Toggle 
                            active={formData.notificationPreferences.push} 
                            onClick={() => handleToggle('push')} 
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                        <div className="flex items-center gap-3">
                            <CreditCard size={18} className="text-zinc-500" />
                            <div>
                                <p className="text-sm font-bold text-zinc-900">Ödeme Uyarıları</p>
                                <p className="text-[10px] text-zinc-500">Yaklaşan ödemeler hatırlatılır.</p>
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
            <BentoCard glowColor="zinc" className="md:col-span-2 p-8 items-start text-left">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-green-100 text-green-600 ">
                        <ShieldUser size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">Güvenlik</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full">
                    <div>
                        <h4 className="text-sm font-bold text-zinc-900 mb-2">Şifre Değiştir</h4>
                        <p className="text-xs text-zinc-500 mb-4">Hesabınızın güvenliği için güçlü bir şifre kullanın. Son değişiklik: 3 ay önce.</p>
                      
                        <Button variant="outline" size="sm" className="w-full md:w-auto cursor-pointer border-cyan-200 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 hover:border-cyan-300">
                            <Lock size={16} className="mr-2" />
                            Şifre Yenile
                        </Button>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-zinc-200 pt-6 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-between mb-2">
                             <h4 className="text-sm font-bold text-zinc-900">İki Faktörlü Doğrulama (2FA)</h4>
                             <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold border border-green-100">AKTİF</span>
                        </div>
                        <p className="text-xs text-zinc-500 mb-4">Giriş yaparken telefonunuza gönderilen kodu girmeniz gerekir.</p>
                        <Button variant="danger" size="sm" className="w-full md:w-auto opacity-100 cursor-pointer">
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