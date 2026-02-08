import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_SUBSCRIPTIONS, SERVICE_LOGOS } from "../utils/constants";
import { useUI } from "./UIContext";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

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

const safeJSONParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.warn(`Error parsing ${key} from localStorage, using fallback.`, error);
        return fallback;
    }
};

export const DataProvider = ({ children }) => {
    const { addNotification } = useUI(); 

   
    const getLogoByName = (name) => {
        if (!name) return SERVICE_LOGOS.DEFAULT;
        const lowerName = name.toLowerCase();
        
        const match = LOGO_MAPPINGS.find(item => 
        item.keywords.some(keyword => lowerName.includes(keyword))
        );

        return match ? match.logo : SERVICE_LOGOS.DEFAULT;
    };

   
    const [subscriptions, setSubscriptions] = useState(() => {
        
        let parsedSubs = safeJSONParse("subscriptions", INITIAL_SUBSCRIPTIONS);
        
        // eğer veri bozuksa veya array değilse fallbacke dön
        if (!Array.isArray(parsedSubs)) parsedSubs = INITIAL_SUBSCRIPTIONS;

        return parsedSubs.map(sub => ({ 
            ...sub, 
            status: sub.status || 'active',
            image: getLogoByName(sub.name) 
        }));
    });

    
    const [transactions, setTransactions] = useState(() => {
        const savedTx = safeJSONParse("transactions", null);
        if (savedTx && Array.isArray(savedTx)) {
            return savedTx.map(tx => ({
                ...tx,
                icon: getLogoByName(tx.name)
            }));
        }
        return INITIAL_SUBSCRIPTIONS.map((sub) => ({
            id: `init-tx-${sub.id}`,
            name: sub.name,
            date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
            amount: -parseFloat(sub.price),
            type: "subscription",
            category: sub.category,
            icon: sub.image 
        }));
    });

   
    useEffect(() => { localStorage.setItem("subscriptions", JSON.stringify(subscriptions)); }, [subscriptions]);
    useEffect(() => { localStorage.setItem("transactions", JSON.stringify(transactions)); }, [transactions]);

    
    const totalExpenses = subscriptions
        .filter(sub => sub.status === 'active')
        .reduce((total, sub) => total + parseFloat(sub.price), 0);

   
    const addSubscription = (newSub) => {
        const finalImage = newSub.image || getLogoByName(newSub.name);
      
        setSubscriptions([...subscriptions, { ...newSub, image: finalImage, id: crypto.randomUUID(), status: 'active' }]);
        
        const newTransaction = {
            id: crypto.randomUUID(),
            name: newSub.name,
            date: "Bugün",
            amount: -parseFloat(newSub.price),
            type: "subscription",
            category: newSub.category,
            icon: finalImage
        };
        setTransactions(prev => [newTransaction, ...prev]);

       
        addNotification("Yeni Abonelik", `${newSub.name} başarıyla takibe alındı.`);
    };

    const updateSubscription = (updatedSub) => {
        setSubscriptions(prev => prev.map(sub => {
            if (sub.id === updatedSub.id) {
                const finalImage = updatedSub.image || getLogoByName(updatedSub.name);
                return { ...updatedSub, image: finalImage };
            }
            return sub;
        }));
    };


    const removeSubscription = (id) => {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    };

    
    const cancelSubscription = (id) => {
        const subToCancel = subscriptions.find(sub => sub.id === id);
        if(!subToCancel) return;

        setSubscriptions(prev => prev.map(sub => 
            sub.id === id 
                ? { ...sub, status: 'canceled', canceledDate: new Date().toLocaleDateString('tr-TR') } 
                : sub
        ));

        addNotification("Abonelik İptal Edildi", `${subToCancel.name} aboneliği iptal edildi. Artık toplam gidere yansımayacak.`, "alert");

        const cancelTx = {
            id: crypto.randomUUID(),
            name: subToCancel.name,
            date: "Bugün",
            amount: 0,
            type: "cancellation",
            category: "İptal İşlemi",
            icon: subToCancel.image
        };
        setTransactions(prev => [cancelTx, ...prev]);
    };

    return (
        <DataContext.Provider value={{
            subscriptions,
            addSubscription,
            updateSubscription,
            removeSubscription,
            cancelSubscription,
            totalExpenses,
            transactions,
            getLogoByName
        }}>
            {children}
        </DataContext.Provider>
    );
};