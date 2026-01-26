import { useState } from "react";
import { Plus, Search, X, Trash2, Tag, Calendar } from "lucide-react";
import Button from "../ui/Button";
import { useGlobal } from "../../context/GlobalContext";

// platform listesi
const PLATFORMS = [
    { id: "p1", name: "Netflix", category: "Eğlence", price: "199.99", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { id: "p2", name: "Spotify", category: "Müzik", price: "59.99", color: "green", image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
    { id: "p3", name: "YouTube Premium", category: "Video", price: "57.99", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" },
    { id: "p4", name: "Amazon Prime", category: "Alışveriş", price: "39.00", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png" },
    { id: "p5", name: "Disney+", category: "Eğlence", price: "134.99", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
    { id: "p6", name: "Apple One", category: "Paket", price: "194.00", color: "zinc", image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { id: "p7", name: "iCloud+", category: "Bulut", price: "12.99", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/ICloud_logo.svg" },
    { id: "p8", name: "Exxen", category: "Eğlence", price: "160.90", color: "yellow", image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Exxen_logo.svg" },
    { id: "p9", name: "BluTV", category: "Eğlence", price: "99.90", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/1/16/BluTV_Logo.png" },
    { id: "p10", name: "Xbox Game Pass", category: "Oyun", price: "159.00", color: "green", image: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Xbox_Game_Pass_logo.svg" },
    { id: "p11", name: "PlayStation Plus", category: "Oyun", price: "200.00", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_plus_logo.png" },
    { id: "p12", name: "Discord Nitro", category: "Sosyal", price: "104.99", color: "purple", image: "https://assets-global.website-files.com/6257adef93867e56f84d3092/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" },
    { id: "p13", name: "Mubi", category: "Film", price: "129.00", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/2/29/MUBI_logo.svg" },
    { id: "p14", name: "Tod TV", category: "Spor", price: "249.00", color: "purple", image: "https://upload.wikimedia.org/wikipedia/commons/2/20/Tod_logo.svg" },
    { id: "p15", name: "Gain", category: "Eğlence", price: "99.00", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/6/66/Gain_Logo.png" },
    { id: "p16", name: "Adobe Creative Cloud", category: "Yazılım", price: "582.00", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Creative_Cloud.svg" },
    { id: "p17", name: "Canva Pro", category: "Tasarım", price: "149.00", color: "blue", image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg" },
    { id: "p18", name: "ChatGPT Plus", category: "Yapay Zeka", price: "650.00", color: "green", image: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
    { id: "p19", name: "Duolingo Plus", category: "Eğitim", price: "89.99", color: "green", image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Duolingo_icon.svg" },
    { id: "p20", name: "Tinder Gold", category: "Yaşam Tarzı", price: "250.00", color: "red", image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/TinderIcon-2017.svg" },
];

const SubscriptionList = () => {
    const { subscriptions, addSubscription, removeSubscription } = useGlobal(); 
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // arama filtresi
    const filteredPlatforms = PLATFORMS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // abonelik ekleme
    const handleAddPlatform = (platform) => {
        
        // mükerrer kayıt kontrolü
        const isAlreadySubscribed = subscriptions.some(sub => sub.name === platform.name);
        if (isAlreadySubscribed) return;

        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1; 
        const randomDate2025 = `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const newSubscription = {
            ...platform,
            id: Date.now(),
            startDate: randomDate2025
        };

        if (addSubscription) {
             addSubscription(newSubscription);
        } else {
             console.log("Eklenecek Veri:", newSubscription);
        }
        
        setIsAddingMode(false);
    };

    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 pb-10">
            
            {/* başlık ve kontroller */}
            <div className="flex items-center mb-8">
                <div></div>

                <div className="flex gap-3">
                     {isAddingMode && (
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Platform ara..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:border-yellow-400 w-64 transition-all shadow-sm"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        </div>
                     )}

                    <Button 
                        onClick={() => {
                            setIsAddingMode(!isAddingMode);
                            setSearchQuery("");
                        }}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer border",
                            isAddingMode 
                            // geri dön stili
                            ? "bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-zinc-200 shadow-sm" 
                            
                            // ekleme stili
                            : "bg-yellow-400 text-yellow-950 hover:bg-yellow-500 shadow-md border-transparent hover:shadow-lg hover:shadow-yellow-200"
                        )}
                    >
                        {isAddingMode ? <ArrowLeft size={18} /> : <Plus size={20} />}
                        {isAddingMode ? "Geri Dön" : "Yeni Abonelik Ekle"}
                    </Button>
                </div>
            </div>

            {/* içerik */}
            {isAddingMode ? (

                // seçim listesi
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredPlatforms.map((platform) => {

                        // abonelik kontrolü
                        const isSubscribed = subscriptions.some(sub => sub.name === platform.name);

                        return (
                            <div 
                                key={platform.id}
                                className={cn(
                                    "group relative bg-white border border-zinc-200 rounded-3xl p-4 flex flex-col items-center text-center transition-all duration-300",
                                    isSubscribed 
                                        ? "opacity-75 cursor-default bg-zinc-50" 
                                        : "hover:border-yellow-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                                )}
                                onClick={() => handleAddPlatform(platform)}
                            >
                                <div className="w-16 h-16 mb-4 rounded-2xl bg-zinc-50 p-3 flex items-center justify-center border border-zinc-100 group-hover:scale-110 transition-transform">
                                    <img src={platform.image} alt={platform.name} className="w-full h-full object-contain" onError={(e) => e.target.style.display='none'} />
                                </div>
                                
                                <h3 className="font-bold text-zinc-900 mb-1">{platform.name}</h3>
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">{platform.category}</span>
                                
                                <div className="mt-auto pt-3 border-t border-zinc-100 w-full flex flex-col items-center justify-center gap-1">
                                    <div className="flex items-center gap-1">
                                        <span className={cn("text-sm font-bold", isSubscribed ? "text-zinc-500" : "text-zinc-900")}>{platform.price}</span>
                                        <span className="text-[13px] font-bold text-zinc-400">₺/ay</span>
                                    </div>
                                    
                                    {/* abone olundu etiketi */}
                                    {isSubscribed && (
                                        <div className="flex items-center gap-1 mt-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                                            <CheckCircle2 size={20} />
                                            <span className="text-[13px] font-bold">Abone Olundu</span>
                                        </div>
                                    )}
                                </div>

                                {!isSubscribed && (
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-yellow-900 shadow-sm">
                                            <Plus size={14} strokeWidth={3} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                // mevcut abonelikler
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subscriptions.map((sub) => (
                        <div 
                            key={sub.id} 
                            className="group relative bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        >
                            {/* kart başlığı */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 p-2.5 flex items-center justify-center shadow-sm">
                                    <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                                </div>
                                <button 
                                    className="p-2 rounded-xl bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer"
                                    title="Aboneliği Sil"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if(removeSubscription) removeSubscription(sub.id);
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* kart detayları */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-zinc-900 mb-2">{sub.name}</h3>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                        <Tag size={12} className="text-zinc-400" />
                                        {sub.category}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                        <Calendar size={12} className="text-zinc-400" />
                                        {sub.startDate}
                                    </div>
                                </div>
                            </div>

                            {/* fiyat bilgisi */}
                            <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                                <span className="text-sm font-medium text-zinc-500">Aylık Ödeme</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-zinc-900">{sub.price}</span>
                                    <span className="text-sm font-bold text-zinc-400">₺</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* boş liste durumu */}
                    {subscriptions.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
                            <p className="text-zinc-400 font-medium">Henüz hiç aboneliğiniz yok.</p>
                            <Button variant="outline" className="mt-4" onClick={() => setIsAddingMode(true)}>İlk Aboneliğini Ekle</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubscriptionList;