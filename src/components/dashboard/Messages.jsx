import { useState, useEffect, useRef } from "react";
import { Phone, Video, MoreVertical, Send, Paperclip, CheckCheck, ShieldCheck, Headset, Clock } from "lucide-react";
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
      <div className="flex items-center justify-between p-4 rounded-3xl bg-yellow-50 border border-yellow-100 shadow-sm">
          <div className="flex items-center gap-4">
               <div className="p-2.5 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-600">
                  <Headset size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      Destek Ekibi Çalışma Saatleri
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">
                      Müşteri temsilcilerimiz hafta içi <span className="text-yellow-600 font-bold">09:00 - 18:00</span> saatleri arasında hizmet vermektedir.
                  </p>
               </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-200 text-xs font-bold text-yellow-700">
              <Clock size={14} />
              <span>Canlı Destek Aktif</span>
          </div>
      </div>

      {/* Sohbet Alanı  */}
      <div className="flex-1 p-0 flex flex-col overflow-hidden relative border border-zinc-200 bg-white rounded-3xl shadow-md">
            
            {/* sohbet başlığı */}
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">

                    {/* Profil İkonu */}
                    <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    
                         <Headset size={22} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                            {activeContact?.name}
                            <span className="px-2 py-0.5 rounded-md text-[10px] bg-blue-50 border border-blue-100 text-blue-600 font-bold tracking-wide uppercase">Resmi Hesap</span>
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs text-zinc-500 font-medium">
                                Ortalama yanıt: <span className="text-zinc-700">~2 Dakika</span>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    
                    {/*  Telefon İkonu */}
                    <button className="p-2.5 rounded-xl hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100 cursor-pointer" title="Sesli Arama">
                        <Phone size={18} />
                    </button>

                    {/* Video İkonu */}
                    <button className="p-2.5 rounded-xl hover:bg-blue-50 text-zinc-400 hover:text-blue-500 transition-all border border-transparent hover:border-blue-100 cursor-pointer" title="Görüntülü Destek">
                        <Video size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all border border-transparent hover:border-zinc-200 cursor-pointer">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            {/* mesajlaşma alanı */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-50/50">
                
                {/* şifreleme uyarısı */}
                <div className="flex justify-center mb-8">
                    <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-4 py-1.5 rounded-full border border-zinc-200 shadow-sm flex items-center gap-1.5">
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
                            "max-w-[75%] px-5 py-3.5 text-sm relative shadow-sm",
                            msg.sender === "me" 
                                ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-blue-200" 
                                : "bg-white text-zinc-800 rounded-2xl rounded-tl-sm border border-zinc-200 shadow-zinc-200"
                        )}>
                            <p className="leading-relaxed tracking-wide">{msg.text}</p>
                            <div className={cn(
                                "text-[10px] mt-1.5 flex items-center justify-end gap-1 font-medium",
                                msg.sender === "me" ? "text-blue-100/80" : "text-zinc-400"
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
            <div className="p-5 bg-white border-t border-zinc-200 z-20">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <button type="button" className="p-3.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors border border-zinc-200 group cursor-pointer">
                        <Paperclip size={20} className="group-hover:rotate-45 transition-transform duration-300" />
                    </button>
                    
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Sorununuzu buraya yazın..." 
                            className="w-full bg-zinc-50 text-sm text-zinc-900 rounded-xl pl-5 pr-12 py-3.5 border border-zinc-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all placeholder:text-zinc-400"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-zinc-100 text-xs text-zinc-400 border border-zinc-200 hidden sm:block pointer-events-none">
                            ↵ Enter
                        </div>
                    </div>
                    
                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="icon" 
                        className={cn(
                            "w-12 h-12 rounded-xl transition-all duration-300 cursor-pointer",
                            !inputText.trim() ? "bg-zinc-200 text-zinc-400 border-zinc-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-200"
                        )}
                        disabled={!inputText.trim()}
                    >
                        <Send size={20} className={cn("transition-transform duration-300", inputText.trim() && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
                    </Button>
                </form>
            </div>

      </div>

    </div>
  );
};

export default Messages;