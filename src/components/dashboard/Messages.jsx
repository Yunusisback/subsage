import { useState, useEffect, useRef } from "react";
import { Phone, Video, MoreVertical, Send, Paperclip, CheckCheck, ShieldCheck, Headset, Clock } from "lucide-react";
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
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Çalışma Saatleri */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
               <div className="p-2.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <Headset size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      Destek Ekibi Çalışma Saatleri
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                  </h4>
                  <p className="text-xs text-yellow-200/70 font-medium mt-0.5">
                      Müşteri temsilcilerimiz hafta içi <span className="text-yellow-400 font-bold">09:00 - 18:00</span> saatleri arasında hizmet vermektedir.
                  </p>
               </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/10 text-xs font-bold text-yellow-500">
              <Clock size={14} />
              <span>Canlı Destek Aktif</span>
          </div>
      </div>

      {/* Sohbet Alanı */}
      <BentoCard glowColor="blue" className="flex-1 p-0 flex flex-col overflow-hidden relative border border-white/5 bg-[#0C0C0E]">
            
            {/* sohbet başlığı */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/2 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-600/20 to-blue-900/20 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
                         <ShieldCheck size={22} className="text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            {activeContact?.name}
                            <span className="px-2 py-0.5 rounded-md text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-300 font-bold tracking-wide uppercase">Resmi Hesap</span>
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)] animate-pulse"></span>
                            <span className="text-xs text-zinc-400 font-medium">
                                Ortalama yanıt: <span className="text-zinc-300">~2 Dakika</span>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/10" title="Sesli Arama"><Phone size={18} /></button>
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/10" title="Görüntülü Destek"><Video size={18} /></button>
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all border border-transparent hover:border-white/10"><MoreVertical size={18} /></button>
                </div>
            </div>

            {/* mesajlaşma alanı */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent">
                
                {/* şifreleme uyarısı */}
                <div className="flex justify-center mb-8">
                    <span className="text-[10px] font-medium text-zinc-500 bg-zinc-900/80 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm shadow-sm flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-yellow-500" /> 
                        Bu sohbet uçtan uca şifrelenmektedir.
                    </span>
                </div>

                {activeMessages.map((msg) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        key={msg.id} 
                        className={cn("flex w-full", msg.sender === "me" ? "justify-end" : "justify-start")}
                    >
                        <div className={cn(
                            "max-w-[75%] px-5 py-3.5 text-sm relative shadow-lg backdrop-blur-sm",
                            msg.sender === "me" 
                                ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm border border-blue-500/50 shadow-blue-900/20" 
                                : "bg-background text-zinc-100 rounded-2xl rounded-tl-sm border border-white/10 shadow-black/20"
                        )}>
                            <p className="leading-relaxed tracking-wide">{msg.text}</p>
                            <div className={cn(
                                "text-[10px] mt-1.5 flex items-center justify-end gap-1 font-medium",
                                msg.sender === "me" ? "text-blue-100/70" : "text-zinc-500"
                            )}>
                                {msg.time}
                                {msg.sender === "me" && <CheckCheck size={14} className="text-blue-200" />}
                            </div>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* mesaj yazma alanı */}
            <div className="p-5 bg-[#0C0C0E]/80 border-t border-white/5 z-20 backdrop-blur-xl">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <button type="button" className="p-3.5 rounded-xl bg-white/3 hover:bg-white/8 text-zinc-400 hover:text-white transition-colors border border-white/5 hover:border-white/10 group">
                        <Paperclip size={20} className="group-hover:rotate-45 transition-transform duration-300" />
                    </button>
                    
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Sorununuzu buraya yazın..." 
                            className="w-full bg-white/3 text-sm text-white rounded-xl pl-5 pr-12 py-3.5 border border-white/5 focus:border-blue-500/50 focus:bg-white/6 focus:outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/5 text-xs text-zinc-500 border border-white/5 hidden sm:block">
                            ↵ Enter
                        </div>
                    </div>
                    
                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="icon" 
                        className={cn(
                            "w-12 h-12 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)]",
                            !inputText.trim() ? "bg-zinc-800 text-zinc-600 border-zinc-700 shadow-none cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500"
                        )}
                        disabled={!inputText.trim()}
                    >
                        <Send size={20} className={cn("transition-transform duration-300", inputText.trim() && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
                    </Button>
                </form>
            </div>

      </BentoCard>

    </div>
  );
};

export default Messages;