import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, CheckCheck, ShieldCheck, Headset, MoreVertical, Camera } from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../utils/helpers";
import { motion } from "framer-motion";
import { useUI } from "../../context/UIContext";
import toast from "react-hot-toast";

const Messages = () => {
  const { messages, sendMessage } = useUI(); 
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Sadece teknik destek id 1 aktif
  const activeContactId = 1;
  const activeMessages = messages[activeContactId] || [];

  const contactInfo = {
    name: "SubSage Destek",
    role: "Çevrimiçi",
    status: "online"
  };

  // Mesaj gelince aşağı kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);


  const handleAttachment = () => {
      toast.success("Dosya yöneticisi açıldı 📎");
  };

  const handleCamera = () => {
      toast.success("Kamera başlatılıyor 📷");
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Bizim mesajımız
    sendMessage(activeContactId, inputText, "me");
    setInputText("");
    
    // 2. oto cevap simülasyonu
    setTimeout(() => {
        const replies = [
            "Talebiniz alınmıştır, ekiplerimiz en kısa sürede kontrol sağlayacaktır.",
            "Şu an sistemlerimizde kısa süreli bir bakım çalışması olabilir, lütfen bekleyiniz.",
            "Konuyla ilgili destek kaydınız (Ticket #4921) başarıyla oluşturuldu.",
            "Başka yardımcı olabileceğim bir konu var mı?"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        sendMessage(activeContactId, randomReply, "them");
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4 max-w-5xl mx-auto">
      
      {/* Tek Sohbet Ekranı */}
      <div className="h-full flex flex-col bg-white dark:bg-zinc-900 rounded-4xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-black/30 overflow-hidden relative">
            
            {/* Sohbet Başlığı */}
            <div className="p-4 md:p-6 border-b border-cyan-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    
                    {/* profil logo */}
                    <div className="relative">
                        <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-100 dark:border-cyan-500/20 shadow-sm shrink-0 overflow-hidden">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                             </svg>
                        </div>
                       
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
                    </div>

                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight">{contactInfo.name}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium bg-cyan-50 dark:bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-100 dark:border-cyan-500/20">
                                {contactInfo.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer transition-colors">
                        <MoreVertical size={20} />
                    </Button>
                </div>
            </div>

          
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-zinc-900/50 relative custom-scrollbar">
                
              
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Güvenlik Uyarısı */}
                <div className="flex justify-center my-6 relative z-10">
                    <div className="bg-white/80 dark:bg-zinc-800/50 backdrop-blur-sm text-zinc-500 dark:text-zinc-400 px-4 py-1.5 rounded-full text-[10px] font-semibold border border-zinc-200 dark:border-zinc-700/50 flex items-center gap-1.5 shadow-sm select-none">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Bu sohbet uçtan uca şifrelenmektedir.
                    </div>
                </div>

             
                {activeMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-400 relative z-10">
                         <div className="w-20 h-20 bg-white dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
                            <Headset size={40} className="text-cyan-200 dark:text-cyan-600/50" />
                         </div>
                         <h4 className="text-zinc-900 dark:text-zinc-100 font-bold text-lg mb-1">Size nasıl yardımcı olabiliriz?</h4>
                         <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs">Abonelikleriniz, ödemeleriniz veya teknik sorunlarınız için buradayız.</p>
                    </div>
                )}

              
                {activeMessages.map((msg) => {
                    const isMe = msg.sender === "me";
                    return (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={cn("flex w-full relative z-10", isMe ? "justify-end" : "justify-start")}
                        >
                            <div className={cn(
                                "max-w-[80%] md:max-w-[65%] px-5 py-3.5 shadow-sm relative group backdrop-blur-sm",
                                isMe 
                                    ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white rounded-3xl rounded-tr-none dark:shadow-cyan-900/20" 
                                    : "bg-white/90 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-700/50 rounded-3xl rounded-tl-none" 
                            )}>
                                <p className="text-[15px] leading-relaxed tracking-wide">{msg.text}</p>
                                
                                <div className={cn(
                                    "flex items-center gap-1 justify-end mt-1.5 text-[10px] font-medium opacity-80",
                                    isMe ? "text-cyan-50" : "text-zinc-400 dark:text-zinc-500"
                                )}>
                                    <span>{msg.time}</span>
                                    {isMe && <CheckCheck size={14} className="opacity-90" />}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* İnput alanı */}
            <div className="p-3 md:p-4 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800 z-20">
                <form onSubmit={handleSend} className="flex items-end gap-2 md:gap-3">
                    
                    
                    <div className="flex items-center gap-1 pb-1">
                     
                        <Button 
                            type="button" 
                            onClick={handleAttachment}
                            variant="ghost" 
                            size="icon" 
                            className="w-10 h-10 text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-full transition-colors duration-200 cursor-pointer"
                            title="Dosya Ekle"
                        >
                            <Paperclip size={22} className="rotate-45" />
                        </Button>
                        
                      
                        <Button 
                            type="button" 
                            onClick={handleCamera}
                            variant="ghost" 
                            size="icon" 
                            className="w-10 h-10 text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-full transition-colors duration-200 cursor-pointer"
                            title="Fotoğraf Çek"
                        >
                            <Camera size={22} />
                        </Button>
                    </div>
                    
                  
                    <div className="flex-1 relative bg-slate-100 dark:bg-zinc-800/50 rounded-3xl flex items-center min-h-12.5 border border-transparent focus-within:border-cyan-200 dark:focus-within:border-cyan-600/30 focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:ring-4 focus-within:ring-cyan-50/50 dark:focus-within:ring-cyan-900/20 transition-all duration-300">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Bir mesaj yazın..." 
                            className="w-full bg-transparent text-[15px] text-zinc-900 dark:text-zinc-100 px-5 py-3 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-medium"
                        />
                    </div>
                    
              
                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="icon" 
                        className={cn(
                            "w-12 h-12 rounded-full shrink-0 transition-all duration-300 ease-out flex items-center justify-center",
                            !inputText.trim() 
                                ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-300 dark:text-zinc-600 cursor-not-allowed" 
                                : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 cursor-pointer" 
                        )}
                        disabled={!inputText.trim()}
                    >
                        <Send size={22} className={cn("transition-transform duration-300", inputText.trim() && "ml-0.5")} />
                    </Button>
                </form>
            </div>

      </div>
    </div>
  );
};

export default Messages;