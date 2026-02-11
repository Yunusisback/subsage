import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { toast } from "react-hot-toast";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InputField = ({ label, type, placeholder, value, onChange, required }) => (
  <div className="space-y-1.5 group">
    <label className="text-xs font-bold text-cyan-600 uppercase tracking-wide ml-1 transition-colors group-focus-within:text-cyan-700">
      {label}
    </label>
    <div className="relative">
      <input
        required={required}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-zinc-50 border border-transparent text-zinc-900 text-sm rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 shadow-sm focus:shadow-md"
      />
    </div>
  </div>
);

const AuthPage = () => {
  const { login, signup, loginAsGuest } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        await new Promise(resolve => setTimeout(resolve, 600));

        if (isLogin) {
            await login(formData.email, formData.password);
            toast.success("Tekrar hoş geldin!");
        } else {
            await signup(formData.email, formData.password, formData.fullName);
            toast.success("Hesabın oluşturuldu! Lütfen e-postanı onayla.");
            setIsLogin(true);
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message || "Bir hata oluştu");
    } finally {
        setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
      setLoading(true);
      setTimeout(() => {
          loginAsGuest();
          setLoading(false);
      }, 800);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isLogin ? 20 : -20 }
  };

  return (
    <div className="flex h-screen w-full bg-white text-zinc-900 font-sans selection:bg-cyan-100 selection:text-cyan-900 overflow-hidden">
        
        {/* sol taraf görsel alan */}
        <div className="hidden lg:flex w-1/2 h-full bg-zinc-50 relative items-center justify-center p-16">
             <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-200/30 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-100 h-100 bg-blue-100/40 rounded-full blur-[100px] opacity-40"></div>
             </div>

             <div className="relative z-10 max-w-lg">
                <div className="flex items-center gap-3 mb-10">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500 drop-shadow-sm">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <h1 className="text-4xl font-bold tracking-tight text-cyan-800">SubSage</h1>
                </div>
                
                <blockquote className="space-y-6">
                    <p className="text-4xl font-semibold leading-tight text-zinc-800">
                        "Aboneliklerini yönetmek artık karmaşık değil. <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-lg box-decoration-clone">Basit, hızlı ve net.</span>"
                    </p>
                    <footer className="flex items-center gap-4 pt-4">
                         <div className="w-12 h-12 bg-white rounded-full border border-zinc-200 p-0.5 shadow-sm">
                             <img src="https://i.pravatar.cc/150?img=32" alt="Kullanıcı" className="w-full h-full rounded-full object-cover grayscale opacity-80" />
                         </div>
                        <div>
                            <cite className="not-italic font-bold block text-zinc-900">Zeynep Yılmaz</cite>
                            <span className="text-zinc-500 text-sm font-medium">Serbest Tasarımcı</span>
                        </div>
                    </footer>
                </blockquote>
             </div>
        </div>

        {/* sağ taraf form alanı */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white">
            <div className="min-h-full flex flex-col justify-center lg:justify-start p-6 sm:p-12 lg:p-24 lg:pt-24">
                <div className="max-w-100 w-full mx-auto">
                    
                    {/* başlık bolumu */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-cyan-600">
                            {isLogin ? " Hoş Geldin! " : "Hesap Oluştur"}
                        </h2>
                        <p className="text-zinc-400 mt-2 text-sm">
                            {isLogin ? "Kaldığın yerden devam etmek için giriş yap." : "Aboneliklerini yönetmeye hemen başla."}
                        </p>
                    </div>

                    {/* geçiş butonları */}
                    <div className="flex p-1 bg-zinc-100 rounded-xl mb-8 relative">
                        <div className="absolute inset-0 p-1 flex">
                            <motion.div 
                                layout
                                className="w-1/2 bg-white rounded-lg shadow-sm border border-zinc-200/50"
                                initial={false}
                                animate={{ x: isLogin ? 0 : "100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </div>
                        <button 
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 relative z-10 py-2 text-sm font-bold transition-colors duration-200 ${isLogin ? "text-cyan-600" : "text-zinc-500 hover:text-cyan-700"}`}
                        >
                            Giriş Yap
                        </button>
                        <button 
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 relative z-10 py-2 text-sm font-bold transition-colors duration-200 ${!isLogin ? "text-cyan-600" : "text-zinc-500 hover:text-cyan-700"}`}
                        >
                            Kayıt Ol
                        </button>
                    </div>

                    {/* form ınputları */}
                    <AnimatePresence mode="wait">
                        <motion.form 
                            key={isLogin ? "login-form" : "register-form"}
                            variants={slideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSubmit} 
                            className="space-y-4"
                        >
                            {!isLogin && (
                                <InputField 
                                    label="Ad Soyad"
                                    type="text"
                                    placeholder="Örn: Ahmet Yılmaz"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    required
                                />
                            )}

                            <InputField 
                                label="E-Maİl"
                                type="email"
                                placeholder="ornek@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                                
                            />

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-cyan-600 uppercase tracking-wide">Şİfre</label>
                                    {isLogin && <a href="#" className="text-xs font-semibold text-cyan-500 hover:text-cyan-700 transition-colors">Şifremi unuttum?</a>}
                                </div>
                                <input 
                                    required
                                    type="password" 
                                    className="w-full bg-zinc-50 border border-transparent text-zinc-900 text-sm rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 shadow-sm focus:shadow-md"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-11 rounded-xl text-sm font-bold hover:shadow-cyan-300/50 transition-all active:scale-[0.98] mt-2 cursor-pointer flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin text-white/80" />
                                ) : (
                                    <>
                                        {isLogin ? "Giriş Yap" : "Hesabı Oluştur"}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>
                    
                    {/* ayrıcı çizgi */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cyan-100"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-cyan-600"><span className="bg-white px-2">veya</span></div>
                    </div>

                    {/* misafir girişi */}
                    <button 
                            type="button"
                            onClick={handleGuestLogin}
                            disabled={loading}
                            className="w-full group bg-gray-100 border border-zinc-200 hover:border-cyan-200 hover:bg-cyan-50/50 text-cyan-800 h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                        >
                            {loading ? null : <CheckCircle2 size={20} className="text-cyan-500 group-hover:scale-110 transition-transform" />}
                            <span className="group-hover:text-cyan-700 transition-colors">Misafir Olarak Dene</span>
                    </button>
                    
                    <p className="text-center text-xs text-zinc-400 mt-8 font-medium">
                        Devam ederek <a href="#" className="underline text-cyan-500 hover:text-cyan-800">Kullanım Koşulları</a>'nı kabul etmiş olursunuz.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AuthPage;