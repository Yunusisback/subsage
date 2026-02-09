import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase"; 
import { SERVICE_LOGOS } from "../utils/constants";
import { useUI } from "./UIContext";
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

const LOGO_MAPPINGS = [
  { keywords: ["netflix"], logo: SERVICE_LOGOS.NETFLIX },
  { keywords: ["spotify"], logo: SERVICE_LOGOS.SPOTIFY },
  { keywords: ["youtube"], logo: SERVICE_LOGOS.YOUTUBE },
  { keywords: ["prime", "amazon"], logo: SERVICE_LOGOS.AMAZON },
  { keywords: ["disney"], logo: SERVICE_LOGOS.DISNEY },
  { keywords: ["exxen"], logo: SERVICE_LOGOS.EXXEN },
  { keywords: ["blutv"], logo: SERVICE_LOGOS.BLUTV },
  { keywords: ["xbox"], logo: SERVICE_LOGOS.XBOX },
  { keywords: ["playstation"], logo: SERVICE_LOGOS.PLAYSTATION },
  { keywords: ["icloud", "apple"], logo: SERVICE_LOGOS.ICLOUD },
  { keywords: ["tod"], logo: SERVICE_LOGOS.TOD },
  { keywords: ["discord"], logo: SERVICE_LOGOS.DISCORD },
  { keywords: ["mubi"], logo: SERVICE_LOGOS.MUBI },
  { keywords: ["gain"], logo: SERVICE_LOGOS.GAIN },
  { keywords: ["adobe"], logo: SERVICE_LOGOS.ADOBE },
  { keywords: ["canva"], logo: SERVICE_LOGOS.CANVA },
  { keywords: ["chatgpt"], logo: SERVICE_LOGOS.CHATGPT },
  { keywords: ["duolingo"], logo: SERVICE_LOGOS.DUOLINGO }
];

export const DataProvider = ({ children }) => {
    const { addNotification } = useUI();
    const [subscriptions, setSubscriptions] = useState([]); // Başlangıçta boş
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

    
    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

           
            if (!data || data.length === 0) {
                setSubscriptions(DEMO_DATA);
                
                
                const demoTransactions = DEMO_DATA.map(sub => ({
                    id: `tx-${sub.id}`,
                    name: sub.name,
                    date: new Date().toLocaleDateString('tr-TR'), 
                    amount: -parseFloat(sub.price),
                    type: "subscription",
                    category: sub.category,
                    icon: sub.image
                }));
                setTransactions(demoTransactions);
                return; 
            }

           
            const formattedData = data.map(sub => ({
                ...sub,
                image: sub.image || getLogoByName(sub.name),
                startDate: sub.start_date 
            }));

            setSubscriptions(formattedData);
            
            const generatedTransactions = formattedData.map(sub => ({
                id: `tx-${sub.id}`,
                name: sub.name,
                date: new Date(sub.created_at).toLocaleDateString('tr-TR'),
                amount: -parseFloat(sub.price),
                type: "subscription",
                category: sub.category,
                icon: sub.image
            }));
            setTransactions(generatedTransactions);

        } catch (error) {
            console.error("Hata:", error);
            
            setSubscriptions(DEMO_DATA);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

  
    const addSubscription = async (newSub) => {
        try {
          

            const { data, error } = await supabase
                .from('subscriptions')
                .insert([{
                    name: newSub.name,
                    price: parseFloat(newSub.price),
                    category: newSub.category,
                    start_date: newSub.startDate,
                    image: newSub.image,
                    status: 'active'
                }])
                .select();

            if (error) throw error;

            const addedSub = {
                ...data[0],
                image: data[0].image || getLogoByName(data[0].name),
                startDate: data[0].start_date
            };

          
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
       
        if (id.toString().startsWith('demo-')) {
            setSubscriptions(prev => prev.filter(sub => sub.id !== id));
            toast.success("Demo kayıt silindi.");
            return;
        }

        try {
            const { error } = await supabase.from('subscriptions').delete().eq('id', id);
            if (error) throw error;
            setSubscriptions(prev => prev.filter(sub => sub.id !== id));
            toast.success("Kayıt silindi.");
        } catch (error) {
            console.error("Hata:", error);
        }
    };

 
    const updateSubscription = async (updatedSub) => {};
    
    const cancelSubscription = async (id) => {
      
         if (id.toString().startsWith('demo-')) {
            setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, status: 'canceled' } : sub));
            return;
         }

         try {
            const { error } = await supabase
                .from('subscriptions')
                .update({ status: 'canceled' })
                .eq('id', id);
            if (error) throw error;
            setSubscriptions(prev => prev.map(sub => sub.id === id ? { ...sub, status: 'canceled' } : sub));
        } catch (error) {
            console.error(error);
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