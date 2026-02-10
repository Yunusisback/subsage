import { useState } from "react";
import { useUser } from "../../context/UserContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

import { ShieldCheck, ArrowRight, Mail, Lock, User, Eye } from "lucide-react"; 

const AuthPage = () => {
    const { login, signup, loginAsGuest } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                toast.success("Hoş geldin!");
            } else {
                await signup(email, password, fullName);
                toast.success("Kayıt başarılı! Giriş yapılıyor...");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                
            
                <div className="w-full md:w-1/2 bg-slate-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
                
                  
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    
                    <div className="relative z-10">
                     
                        <div className="flex items-center gap-3 mb-2">
                          
                             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                             <span className="text-3xl font-black tracking-tighter text-white">SubSage</span>
                        </div>
                        <p className="text-cyan-200/80 text-sm font-medium tracking-wide ml-1">Akıllı Abonelik Yönetimi</p>
                    </div>

                    <div className="relative z-10 my-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            Harcamaların Kontrol Altında.
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            Tüm aboneliklerini tek bir yerden yönet, gereksiz ödemelerden kurtul ve tasarruf etmeye başla.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span>Supabase ile Uçtan Uca Şifreli & Güvenli</span>
                    </div>
                </div>

                
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="max-w-sm mx-auto w-full">
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">
                            {isLogin ? "Tekrar Hoş Geldin" : "Hesap Oluştur"}
                        </h3>
                        <p className="text-slate-500 mb-8 text-sm">
                            {isLogin ? "Hesabına giriş yap ve yönetmeye başla." : "Ücretsiz kayıt ol ve tasarrufa başla."}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Ad Soyad</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Örn: Burak Y."
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 ml-1">E-posta</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="email" 
                                        placeholder="ornek@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 ml-1">Şifre</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm font-medium"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-slate-900 hover:bg-black text-white py-3.5 rounded-xl shadow-lg shadow-slate-200 mt-2 cursor-pointer"
                                isLoading={loading}
                            >
                                {isLogin ? "Giriş Yap" : "Kayıt Ol"} <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </form>

                         <div className="mt-6 flex items-center gap-3">
                            <div className="h-px bg-slate-200 flex-1"></div>
                            <span className="text-slate-400 text-xs font-bold uppercase">veya</span>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>

                        <button 
                            type="button"
                            onClick={loginAsGuest} 
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-white border-2 border-slate-100 hover:border-cyan-100 hover:bg-cyan-50/50 text-slate-600 font-bold py-3.5 rounded-xl transition-all group cursor-pointer"
                        >
                            <Eye size={18} className="text-slate-400 group-hover:text-cyan-600 transition-colors" />
                            <span>Üye Olmadan İncele (Demo)</span>
                        </button>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">
                                {isLogin ? "Hesabın yok mu?" : "Zaten hesabın var mı?"}
                                <button 
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="ml-2 font-bold text-cyan-600 hover:text-cyan-700 transition-colors cursor-pointer"
                                >
                                    {isLogin ? "Kayıt Ol" : "Giriş Yap"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;