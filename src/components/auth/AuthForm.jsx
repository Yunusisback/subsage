import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { toast } from "react-hot-toast";
import { ArrowRight, Loader2, Zap } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

const InputField = ({ label, type, value, onChange, required, id }) => (
  <div className="relative w-full mb-3 group">
    <input
      required={required}
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="block w-full px-4 py-3.5 text-sm text-zinc-900 bg-white rounded-3xl border-2 border-zinc-200 appearance-none focus:outline-none focus:border-cyan-500 group-hover:border-zinc-300 peer transition-all duration-200"
      placeholder=" "
    />
    <label
      htmlFor={id}
      className="absolute left-3 px-1 text-sm text-zinc-400 bg-white duration-200 transform -translate-y-3 scale-75 top-0 origin-left z-10
                 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-cyan-600 peer-focus:top-0
                 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-3.5"
    >
      {label}
    </label>
  </div>
);

const AuthForm = () => {
  const { login, signup, loginAsGuest } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: ""
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
      setGuestLoading(true);
      setTimeout(() => {
          loginAsGuest();
         
      }, 800);
  };

  return (
    <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-white">
 
      <div className="min-h-full flex flex-col justify-start p-6 sm:p-10 lg:p-20 lg:py-12">
    
        <div className="max-w-sm w-full mx-auto">
          
          {/* başlık bolumu */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-cyan-600">
              {isLogin ? "Hoş Geldin!" : "Hesap Oluştur"}
            </h2>
            <p className="text-zinc-400 mt-2 text-sm">
              {isLogin ? "Kaldığın yerden devam etmek için giriş yap." : "Aboneliklerini yönetmeye hemen başla."}
            </p>
          </div>

          
          <div className="flex p-1 bg-zinc-100 rounded-3xl mb-6 relative">
            <button 
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 relative z-10 py-2 text-sm font-bold transition-colors duration-200 ${isLogin ? "text-cyan-500" : "text-zinc-500 hover:text-cyan-700"}`}
            >
              {isLogin && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-white rounded-3xl shadow-sm border border-zinc-200/50"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              Giriş Yap
            </button>
            <button 
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 relative z-10 py-2 text-sm font-bold transition-colors duration-200 ${!isLogin ? "text-cyan-500" : "text-zinc-500 hover:text-cyan-700"}`}
            >
              {!isLogin && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-white rounded-3xl shadow-sm border border-zinc-200/50"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              Kayıt Ol
            </button>
          </div>

          {/* form ınputları */}
          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? "login-form" : "register-form"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onSubmit={handleSubmit} 
              className="space-y-3"
            >
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <InputField 
                    label="Ad Soyad"
                    type="text"
                    id="floating_fullname"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isLogin ? 0.1 : 0.15 }}
              >
                <InputField 
                  label="E-mail"
                  type="email"
                  id="floating_email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </motion.div>

            
              <motion.div 
                className="relative w-full mb-3 group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isLogin ? 0.15 : 0.2 }}
              >
                <input 
                  required
                  type="password"
                  id="floating_password"
                  name="floating_password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full px-4 py-3.5 text-sm text-zinc-900 bg-white rounded-3xl border-2 border-zinc-200 appearance-none focus:outline-none focus:border-cyan-500 group-hover:border-zinc-300 peer transition-all duration-200"
                  placeholder=" "
                />
                <label 
                  htmlFor="floating_password"
                  className="absolute left-3 px-1 text-sm text-zinc-400 bg-white duration-200 transform -translate-y-3 scale-75 top-0 origin-left z-10
                             peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-cyan-600 peer-focus:top-0
                             peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-3.5"
                >
                  Şifre
                </label>
                {isLogin && (
                  <a href="#" className="absolute right-3 top-3.5 text-xs font-semibold text-cyan-500 hover:text-cyan-700 transition-colors z-10">
                    Şifremi unuttum?
                  </a>
                )}
              </motion.div>

              {!isLogin && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <InputField 
                      label="Şifreni Tekrar Gir"
                      type="password"
                      id="floating_confirm_password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <InputField 
                      label="Telefon Numarası"
                      type="tel"
                      id="floating_phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </motion.div>
                </>
              )}

              <motion.button 
                type="submit" 
                disabled={loading || guestLoading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isLogin ? 0.2 : 0.35 }}
                className="w-full group bg-cyan-600 hover:bg-cyan-700 text-white h-11 rounded-3xl text-sm font-bold hover:shadow-cyan-300/50 transition-all active:scale-[0.98] mt-4 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-white/80" />
                ) : (
                  <>
                    {isLogin ? "Giriş Yap" : "Hesabı Oluştur"}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5 " />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>
          
          {/* ayrıcı çizgi */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cyan-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-cyan-600"><span className="bg-white px-2">veya</span></div>
          </div>

     
          <motion.button 
            type="button"
            onClick={handleGuestLogin}
            disabled={loading || guestLoading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: ["0 0 0px rgba(6,182,212,0)", "0 0 5px rgba(6,182,212,1.4)", "0 0 0px rgba(6,182,212,0)"]
            }}
            transition={{ 
              opacity: { delay: 0.2 },
              boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group mb-3 h-12 rounded-3xl text-sm font-bold flex items-center justify-center cursor-pointer overflow-hidden border border-cyan-400/30 bg-linear-to-r from-cyan-500/5 via-cyan-400/10 to-cyan-500/5 backdrop-blur-sm "
          >
        
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent z-0" />
            
           
            <motion.div layout className="relative z-10 flex items-center justify-center">
               <motion.div layout className="p-1.5 rounded-full transition-colors shrink-0">
                 <Zap size={guestLoading ? 24 : 20} className={guestLoading ? "text-cyan-600 fill-cyan-600" : "text-cyan-700 fill-cyan-700"} />
               </motion.div>
               
               <AnimatePresence>
                 {!guestLoading && (
                   <motion.span 
                     layout
                     initial={{ opacity: 1, width: "auto", marginLeft: 12 }}
                     animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                     exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                     transition={{ duration: 0.3 }}
                     className="text-cyan-800 group-hover:text-cyan-900 transition-colors whitespace-nowrap overflow-hidden"
                   >
                     Misafir Modu ile Keşfet
                   </motion.span>
                 )}
               </AnimatePresence>
            </motion.div>
          </motion.button>

    
          {isLogin && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button 
                type="button"
                onClick={() => toast.info("Google girişi yakında aktif olacak")}
                className="w-full group bg-white border-2 border-zinc-200 hover:border-cyan-200 hover:bg-cyan-50/30 text-zinc-800 h-12 rounded-3xl text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="group-hover:text-cyan-700 transition-colors">Google ile Giriş Yap</span>
              </button>

              <button 
                type="button"
                onClick={() => toast.info("Apple girişi yakında aktif olacak")}
                className="w-full group bg-black border-2 border-zinc-800 hover:border-zinc-600 text-white h-12 rounded-3xl text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="group-hover:text-zinc-300 transition-colors">Apple ile Giriş Yap</span>
              </button>
            </motion.div>
          )}
          
          <p className="text-center text-xs text-zinc-400 mt-6 mb-4 font-medium">
            Devam ederek <a href="#" className="underline text-cyan-500 hover:text-cyan-800">Kullanım Koşulları</a>'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;