import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";
import toast from "react-hot-toast";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const safeJSONParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        return fallback;
    }
};

export const UserProvider = ({ children }) => {
  
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    const [userSettings, setUserSettings] = useState(() => {
        return safeJSONParse("userSettings", {
            name: "Misafir",
            email: "",
            avatar: "",
            currency: "TRY",
            language: "tr",
            budgetLimit: 5000,
            notificationPreferences: { email: true, push: true }
        });
    });

    const [spendingLimit, setSpendingLimit] = useState(() => {
        return safeJSONParse("spendingLimit", 15000);
    });

   
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                updateUserSettings({ 
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email.split('@')[0] 
                });
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                 updateUserSettings({ 
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email.split('@')[0] 
                });
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => { localStorage.setItem("userSettings", JSON.stringify(userSettings)); }, [userSettings]);
    useEffect(() => { localStorage.setItem("spendingLimit", JSON.stringify(spendingLimit)); }, [spendingLimit]);

    const updateUserSettings = (newSettings) => setUserSettings(prev => ({ ...prev, ...newSettings }));
    const updateSpendingLimit = (newLimit) => setSpendingLimit(newLimit);

   
    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signup = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        return data;
    };

    const loginAsGuest = () => {
        setIsGuest(true);
        setUser({ id: 'guest', email: 'misafir@demo.com', user_metadata: { full_name: 'Misafir' } });
        updateUserSettings({ name: "Misafir Kullanıcı" });
        toast.success("Misafir moduna geçildi.");
    };

    const logout = async () => {
        if (isGuest) {
            setIsGuest(false);
            setUser(null);
        } else {
            await supabase.auth.signOut();
        }
        toast.success("Çıkış yapıldı");
    };

    return (
        <UserContext.Provider value={{
            user, session, loading, isGuest,
            login, signup, loginAsGuest, logout,
            userSettings, updateUserSettings,
            spendingLimit, updateSpendingLimit
        }}>
            {children}
        </UserContext.Provider>
    );
};