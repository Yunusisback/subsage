import { useState, useEffect, useRef } from "react";
import { Phone, Video, MoreVertical, Send, Paperclip, CheckCheck, ShieldCheck, Headset } from "lucide-react";
import BentoCard from "../ui/BentoCard";
import Button from "../ui/Button";
import { cn } from "../../utils/helpers";
import { motion } from "framer-motion";


const INITIAL_CONTACTS = [
  { 
    id: 1, 
    name: "Teknik Destek", 
    role: "7/24 Canlı Yardım",
    avatar: "https://ui-avatars.com/api/?name=TD&background=2563eb&color=fff&bold=true", 
    lastMsg: "Talebiniz alınmıştır, inceliyoruz.", 
    time: "Şimdi", 
    unread: 1, 
    status: "online" 
  },
];

const INITIAL_MESSAGES = {
  1: [
    { id: 1, sender: "them", text: "Merhaba Burak Bey, SubSage Destek Ekibi'ne hoş geldiniz. 👋", time: "09:00" },
    { id: 2, sender: "them", text: "Abonelikleriniz veya sistemle ilgili yaşadığınız herhangi bir sorunda size yardımcı olmak için buradayız.", time: "09:00" },
  ]
};

const Messages = () => {
  const [activeContactId, setActiveContactId] = useState(1);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const activeContact = INITIAL_CONTACTS.find(c => c.id === activeContactId);
  const activeMessages = messages[activeContactId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, activeContactId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    setInputText("");

    // otomatik cevap simülasyonu
    setTimeout(() => {
        const reply = {
            id: Date.now() + 1,
            sender: "them",
            text: "Mesajınız yetkili birime iletildi. En kısa sürede dönüş yapacağız. 🛠️",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({
            ...prev,
            [activeContactId]: [...(prev[activeContactId] || []), reply]
        }));
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* sol liste alanı */}
      <BentoCard glowColor="zinc" className="lg:col-span-1 p-0 flex flex-col h-full overflow-hidden">
        
        {/* başlık alanı */}
        <div className="p-5 border-b border-white/5 bg-white/5">
            <h3 className="text-white font-bold flex items-center gap-2">
                <Headset size={20} className="text-yellow-500" />
                Destek Talepleri
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Aktif görüşmeleriniz aşağıdadır.</p>
        </div>

        {/* kişi listesi */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {INITIAL_CONTACTS.map((contact) => (
                <button
                    key={contact.id}
                    onClick={() => setActiveContactId(contact.id)}
                    className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group relative",
                        activeContactId === contact.id 
                            ? "bg-blue-600/10 border border-blue-500/20 shadow-inner" 
                            : "hover:bg-white/5 border border-transparent"
                    )}
                >
                    {/* aktif gösterge çizgisi */}
                    {activeContactId === contact.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                    )}

                    <div className="relative">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-lg">
                            <ShieldCheck size={24} />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0C0C0E] animate-pulse"></span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className={cn("text-sm font-bold", activeContactId === contact.id ? "text-blue-100" : "text-zinc-200")}>{contact.name}</h4>
                            <span className="text-[10px] text-zinc-500 bg-black/20 px-2 py-0.5 rounded-full">{contact.time}</span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate font-medium">
                            {contact.role}
                        </p>
                    </div>
                </button>
            ))}
            
            {/* bilgi kutusu */}
            <div className="mt-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                <p className="text-xs text-yellow-200/70 leading-relaxed text-center">
                    Müşteri temsilcilerimiz hafta içi 09:00 - 18:00 saatleri arasında hizmet vermektedir.
                </p>
            </div>
        </div>
      </BentoCard>

      {/* sağ sohbet alanı */}
      <BentoCard glowColor="blue" className="lg:col-span-2 p-0 flex flex-col h-full overflow-hidden relative">
            
            {/* sohbet başlığı */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                         <ShieldCheck size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            {activeContact?.name}
                            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-medium">Resmi Hesap</span>
                        </h3>
                        <span className="text-xs text-zinc-400">
                            Ortalama yanıt süresi: <span className="text-green-400 font-medium">~2 Dakika</span>
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors" title="Sesli Arama"><Phone size={18} /></button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors" title="Görüntülü Destek"><Video size={18} /></button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"><MoreVertical size={18} /></button>
                </div>
            </div>

            {/* mesajlaşma alanı */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-950/50">
                
                {/* şifreleme uyarısı */}
                <div className="flex justify-center mb-6">
                    <span className="text-[10px] text-zinc-500 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                        🔒 Bu sohbet uçtan uca şifrelenmektedir.
                    </span>
                </div>

                {activeMessages.map((msg) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={cn("flex w-full", msg.sender === "me" ? "justify-end" : "justify-start")}
                    >
                        <div className={cn(
                            "max-w-[75%] px-5 py-3 rounded-2xl text-sm relative shadow-md",
                            msg.sender === "me" 
                                ? "bg-blue-600 text-white rounded-br-none" 
                                : "bg-surface text-zinc-200 border border-white/5 rounded-bl-none"
                        )}>
                            <p className="leading-relaxed">{msg.text}</p>
                            <div className={cn(
                                "text-[10px] mt-1.5 flex items-center justify-end gap-1 opacity-70",
                                msg.sender === "me" ? "text-blue-100" : "text-zinc-500"
                            )}>
                                {msg.time}
                                {msg.sender === "me" && <CheckCheck size={13} />}
                            </div>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* mesaj yazma alanı */}
            <div className="p-4 bg-black/40 border-t border-white/5 z-10 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <button type="button" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/5">
                        <Paperclip size={20} />
                    </button>
                    
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Sorununuzu buraya yazın..." 
                        className="flex-1 bg-white/5 text-sm text-white rounded-xl px-5 py-3 border border-white/5 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-zinc-500 shadow-inner"
                    />
                    
                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="icon" 
                        className="bg-blue-600 hover:bg-blue-500 text-white border-none shadow-[0_0_20px_rgba(37,99,235,0.4)] w-12 h-12 rounded-xl"
                        disabled={!inputText.trim()}
                    >
                        <Send size={20} />
                    </Button>
                </form>
            </div>

      </BentoCard>

    </div>
  );
};

export default Messages;