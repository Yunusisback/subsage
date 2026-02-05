import { useState, useEffect, useRef } from "react";
import {  Send, Paperclip, CheckCheck, ShieldCheck, Headset } from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../utils/helpers";
import { motion } from "framer-motion";
import { useGlobal } from "../../context/GlobalContext";

const Messages = () => {
  const { messages, sendMessage } = useGlobal(); 
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Sadece teknik destek ıd 1 aktif
  const activeContactId = 1;
  const activeMessages = messages[activeContactId] || [];

  const contactInfo = {
    name: "Teknik Destek",
    role: "7/24 Canlı Yardım",
    status: "online"
  };

  // Mesaj gelince aşağı kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Bizim mesajımız
    
    sendMessage(activeContactId, inputText, "me");
    setInputText("");
    
    // 2.  oto cevap simülasyonu
    setTimeout(() => {
        const replies = [
            "Talebiniz alınmıştır, ekiplerimiz kontrol ediyor.",
            "Şu an sistemde yoğunluk var, lütfen bekleyiniz.",
            "Bu konu hakkında kayıt oluşturuldu.",
            "Size nasıl daha fazla yardımcı olabilirim?"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        sendMessage(activeContactId, randomReply, "them");
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
      
      {/* Tek Sohbet Ekranı */}
      <div className="h-full flex flex-col bg-cyan-600 rounded-4xl border border-zinc-200 shadow-sm overflow-hidden relative">
            
            {/* Sohbet Başlığı */}
            <div className="p-4 md:p-6 border-b border-cyan-200 flex justify-between items-center bg-zinc-50 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    
                    {/* profil logo */}
                    <div className="w-12 h-12 bg-white border border-zinc-100 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#139ED6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 12l10 5 10-5" />
                            <path d="M2 17l10 5 10-5" />
                        </svg>
                    </div>

                    <div>
                        <h3 className="font-bold text-red-600 text-2xl">{contactInfo.name}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-green-500 animate-pulse border-2 border-white shadow-sm"></span>
                            <span className="text-xs text-zinc-500 font-medium">{contactInfo.role}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
               
                </div>
            </div>

            {/* Mesaj Alanı */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 custom-scrollbar">
                
                {/* Güvenlik Uyarısı */}
                <div className="flex justify-center my-4">
                    <div className="bg-cyan-50 text-cyan-800 px-4 py-2 rounded-full text-[10px] font-bold border border-cyan-300 flex items-center gap-2 shadow-sm">
                        <ShieldCheck size={15} />
                        Bu sohbet uçtan uca şifrelenmektedir.
                    </div>
                </div>

                {activeMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-zinc-400">
                         <div className="p-4 bg-zinc-100 rounded-full mb-2">
                            <Headset size={32} className="opacity-50" />
                         </div>
                         <p className="text-sm font-medium">Nasıl yardımcı olabiliriz?</p>
                    </div>
                )}

                {activeMessages.map((msg) => {
                    const isMe = msg.sender === "me";
                    return (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
                        >
                            <div className={cn(
                                "max-w-[85%] md:max-w-[70%] p-4 rounded-2xl relative shadow-sm group transition-all hover:shadow-md",
                                isMe 
                                    ? "bg-blue-600 text-white rounded-tr-sm" 
                                    : "bg-white text-zinc-700 border border-zinc-100 rounded-tl-sm"
                            )}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <div className={cn(
                                    "flex items-center gap-1 justify-end mt-1 text-[10px] font-medium opacity-70",
                                    isMe ? "text-blue-100" : "text-zinc-400"
                                )}>
                                    <span>{msg.time}</span>
                                    {isMe && <CheckCheck size={12} />}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* İnput Alanı */}
            <div className="p-4 md:p-5 bg-white border-t border-zinc-300">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <Button type="button" variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl shrink-0 cursor-pointer">
                        <Paperclip size={20} />
                    </Button>
                    
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Mesajınızı buraya yazın..." 
                            className="w-full bg-zinc-50 text-sm text-zinc-900 rounded-xl pl-5 pr-12 py-3.5 border border-zinc-200 focus:border-cyan-600 focus:bg-white focus:outline-none transition-all placeholder:text-zinc-400"
                        />
                       
                    </div>
                    
                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="icon" 
                        className={cn(
                            "w-12 h-12 rounded-xl transition-all duration-300 cursor-pointer",
                            !inputText.trim() ? "bg-cyan-900 text-white border-zinc-200 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500 "
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