import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase"; 
import { SERVICE_LOGOS, LOGO_MAPPINGS } from "../utils/constants";
import { useUI } from "./UIContext";
import { useUser } from "./UserContext"; 
import toast from "react-hot-toast";

const DataContext = createContext();

export const useData = () => useContext(DataContext);


const DEMO_DATA = [
  { id: 'demo-1', name: 'Netflix', price: 199.99, category: 'Eğlence', startDate: '2024-01-15', image: SERVICE_LOGOS.NETFLIX, status: 'active' },
  { id: 'demo-2', name: 'Spotify', price: 59.99, category: 'Müzik', startDate: '2024-02-01', image: SERVICE_LOGOS.SPOTIFY, status: 'active' },
  { id: 'demo-3', name: 'YouTube Premium', price: 79.99, category: 'Video', startDate: '2024-03-10', image: SERVICE_LOGOS.YOUTUBE, status: 'active' },
  { id: 'demo-4', name: 'Amazon Prime', price: 39.00, category: 'Alışveriş', startDate: '2024-01-20', image: SERVICE_LOGOS.AMAZON, status: 'active' },
  { id: 'demo-5', name: 'iCloud+', price: 12.99, category: 'Bulut', startDate: '2024-04-05', image: SERVICE_LOGOS.ICLOUD, status: 'active' },
];

export const DataProvider = ({ children }) => {
    const { addNotification } = useUI();
    const { user, isGuest } = useUser(); 
    const [subscriptions, setSubscriptions] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    const getLogoByName = (name) => {
        if (!name) return SERVICE_LOGOS.DEFAULT;
        const lowerName = name.toLowerCase();
        const match = LOGO_MAPPINGS.find(item => 
            item.keywords.some(keyword => lowerName.includes(keyword))
        );
        return match ? match.logo : SERVICE_LOGOS.DEFAULT;
    };

    // abonelikleri işlem geçmişine dönüştürür
    const generateTransactions = (subsData) => {
        return subsData.map(sub => ({
            id: `tx-${sub.id}`,
            name: sub.name,
            
            date: sub.created_at 
                ? new Date(sub.created_at).toLocaleDateString('tr-TR') 
                : new Date().toLocaleDateString('tr-TR'),
            amount: -parseFloat(sub.price),
            type: "subscription",
            category: sub.category,
            icon: sub.image
        }));
    };

    
    const fetchSubscriptions = async () => {
        try {
            setLoading(true);

        
            if (!user || isGuest) {
                setSubscriptions(DEMO_DATA);
                setTransactions(generateTransactions(DEMO_DATA));
                setLoading(false);
                return;
            }

          
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id) 
                .order('created_at', { ascending: false });

            if (error) throw error;

           
            if (!data || data.length === 0) {
             
                setSubscriptions([]);
                setTransactions([]);
                return; 
            }

           
            const formattedData = data.map(sub => {
  
                
                const localLogo = getLogoByName(sub.name);
                const finalImage = localLogo !== SERVICE_LOGOS.DEFAULT 
                    ? localLogo 
                    : (sub.image || SERVICE_LOGOS.DEFAULT);

                return {
                    ...sub,
                    image: finalImage,
                    startDate: sub.start_date 
                };
            });

            setSubscriptions(formattedData);
            setTransactions(generateTransactions(formattedData));

        } catch (error) {
            console.error("Hata:", error);
            toast.error("Veriler yüklenirken hata oluştu.");
         
            setSubscriptions(DEMO_DATA);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [user, isGuest]); 

  
    const addSubscription = async (newSub) => {
        try {
        
            if (!user) {
                toast.error("Kayıt eklemek için giriş yapmalısınız.");
                return;
            }

        
            if (isGuest) {
                const fakeId = `guest-${Date.now()}`;
                const addedSub = {
                    ...newSub,
                    id: fakeId,
                    user_id: 'guest',
                    startDate: newSub.startDate,
                    start_date: new Date(newSub.startDate).toISOString(),
                    image: newSub.image || getLogoByName(newSub.name),
                    status: 'active',
                    created_at: new Date().toISOString()
                };
                
                setSubscriptions(prev => [addedSub, ...prev]);
                addNotification("Başarılı", "Misafir modunda kayıt eklendi.");
                return;
            }

        
            const isoStartDate = new Date(newSub.startDate).toISOString();

            const { data, error } = await supabase
                .from('subscriptions')
                .insert([{
                    user_id: user.id, 
                    name: newSub.name,
                    price: parseFloat(newSub.price),
                    category: newSub.category,
                    start_date: isoStartDate,
                    image: newSub.image,
                    status: 'active'
                }])
                .select();

            if (error) throw error;

       
            const localLogo = getLogoByName(data[0].name);
            const finalImage = localLogo !== SERVICE_LOGOS.DEFAULT 
                ? localLogo 
                : (data[0].image || getLogoByName(data[0].name));

            const addedSub = {
                ...data[0],
                image: finalImage,
                startDate: data[0].start_date
            };

           // Demo verilerle karışmaması için yeni kaydı listenin başına ekliyoruz
            setSubscriptions(prev => {
                const isDemo = prev.some(item => item.id.toString().startsWith('demo-'));
                if (isDemo) return [addedSub]; 
                return [addedSub, ...prev]; 
            });

            addNotification("Başarılı", "Kayıt eklendi.");
            
        } catch (error) {
            console.error("Ekleme hatası:", error);
            toast.error("Kaydedilemedi.");
        }
    };

    
    const removeSubscription = async (id) => {
       
        if (isGuest || id.toString().startsWith('demo-') || id.toString().startsWith('guest-')) {
            setSubscriptions(prev => prev.filter(sub => sub.id !== id));
            toast.success("Kayıt silindi.");
            return;
        }

        try {
            const { error } = await supabase
                .from('subscriptions')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);  

            if (error) throw error;
            setSubscriptions(prev => prev.filter(sub => sub.id !== id));
            toast.success("Kayıt silindi.");
        } catch (error) {
            console.error("Hata:", error);
            toast.error("Silme işlemi başarısız.");
        }
    };

 
    const updateSubscription = async (updatedSub) => {
        if (!user) return;

         
         if (isGuest) {
            setSubscriptions(prev => prev.map(sub => 
               sub.id === updatedSub.id ? { ...sub, ...updatedSub } : sub
           ));
           toast.success("Abonelik güncellendi.");
           return;
       }

        try {
        
            if (updatedSub.id.toString().startsWith('demo-')) {
                toast.error("Demo veriler düzenlenemez.");
                return;
            }

            const { error } = await supabase
                .from('subscriptions')
                .update({
                    name: updatedSub.name,
                    price: parseFloat(updatedSub.price),
                    category: updatedSub.category,
                    start_date: new Date(updatedSub.startDate).toISOString(), 
                    image: updatedSub.image
                })
                .eq('id', updatedSub.id)
                .eq('user_id', user.id); 

            if (error) throw error;

         
            setSubscriptions(prev => prev.map(sub => 
                sub.id === updatedSub.id ? { ...sub, ...updatedSub } : sub
            ));
            
            toast.success("Abonelik güncellendi.");

        } catch (error) {
            console.error("Güncelleme hatası:", error);
            toast.error("Güncelleme başarısız.");
        }
    };
    
    const cancelSubscription = async (id) => {
      
         if (isGuest || id.toString().startsWith('demo-') || id.toString().startsWith('guest-')) {
            setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, status: 'canceled' } : sub));
            toast.success("Abonelik iptal edildi.");
            return;
         }

         try {
            const { error } = await supabase
                .from('subscriptions')
                .update({ status: 'canceled' })
                .eq('id', id)
                .eq('user_id', user.id); 

            if (error) throw error;
            setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, status: 'canceled' } : sub));
            toast.success("Abonelik iptal edildi.");
        } catch (error) {
            console.error(error);
            toast.error("İşlem başarısız.");
        }
    };

    const totalExpenses = subscriptions
        .filter(sub => sub.status === 'active')
        .reduce((total, sub) => total + parseFloat(sub.price), 0);

    return (
        <DataContext.Provider value={{
            subscriptions,
            addSubscription,
            removeSubscription,
            updateSubscription,
            cancelSubscription,
            totalExpenses,
            transactions,
            getLogoByName,
            loading
        }}>
            {children}
        </DataContext.Provider>
    );
};