import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_SUBSCRIPTIONS, INITIAL_NOTIFICATIONS, SERVICE_LOGOS } from "../utils/constants";


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

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);


const safeJSONParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.warn(`Error parsing ${key} from localStorage, using fallback.`, error);
        return fallback;
    }
};

export const GlobalProvider = ({ children }) => {

  // İsimden logoyu bul
  const getLogoByName = (name) => {
    if (!name) return SERVICE_LOGOS.DEFAULT;
    const lowerName = name.toLowerCase();
    
  
    const match = LOGO_MAPPINGS.find(item => 
      item.keywords.some(keyword => lowerName.includes(keyword))
    );

    return match ? match.logo : SERVICE_LOGOS.DEFAULT;
  };

  // state
  const [subscriptions, setSubscriptions] = useState(() => {
    
    let parsedSubs = safeJSONParse("subscriptions", INITIAL_SUBSCRIPTIONS);
    
    // Eğer veri bozuksa veya array değilse fallbacke dön
    if (!Array.isArray(parsedSubs)) parsedSubs = INITIAL_SUBSCRIPTIONS;

    return parsedSubs.map(sub => ({ 
        ...sub, 
        status: sub.status || 'active',
        image: getLogoByName(sub.name) 
    }));
  });

  //  Bildirimler State
  const [notifications, setNotifications] = useState(() => {
    return safeJSONParse("notifications", INITIAL_NOTIFICATIONS);
  });

  
  const [spendingLimit, setSpendingLimit] = useState(() => {
    return safeJSONParse("spendingLimit", 15000);
  });

  // İşlemler State
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

  // Kullanıcı Ayarları State
  const [userSettings, setUserSettings] = useState(() => {
    const defaultSettings = {
        name: "Burak Y.",
        email: "burak@example.com",
        avatar: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkNTM1NTYuanBlZw==",
        currency: "TRY",
        language: "tr",
        budgetLimit: 5000,
        notificationPreferences: {
            email: true,
            push: true,
            weeklyReport: false,
            paymentAlert: true
        }
    };
    return safeJSONParse("userSettings", defaultSettings);
  });

  // Mesajlar State 
  const [messages, setMessages] = useState(() => {
    const defaultMessages = {
        1: [ 
            { id: 1, sender: "them", text: "Merhaba Burak Bey, SubSage Destek Ekibi'ne hoş geldiniz. 👋", time: "09:00" },
            { id: 2, sender: "them", text: "Abonelikleriniz veya sistemle ilgili yaşadığınız herhangi bir sorunda size yardımcı olmak için buradayız.", time: "09:00" },
        ]
    };
    return safeJSONParse("messages", defaultMessages);
  });

  // localStorage senkronizasyonu
  useEffect(() => { localStorage.setItem("subscriptions", JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem("notifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("userSettings", JSON.stringify(userSettings)); }, [userSettings]);
  useEffect(() => { localStorage.setItem("messages", JSON.stringify(messages)); }, [messages]); 
  
 
  useEffect(() => { localStorage.setItem("spendingLimit", JSON.stringify(spendingLimit)); }, [spendingLimit]);

  // hesaplamalar
  const totalExpenses = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => total + parseFloat(sub.price), 0);

  // Ayar Güncelleme
  const updateUserSettings = (newSettings) => {
      setUserSettings(prev => ({ ...prev, ...newSettings }));
  };

  
  const updateSpendingLimit = (newLimit) => {
      setSpendingLimit(newLimit);
  };

  // Mesaj Gönderme
  const sendMessage = (contactId, text, sender = "me") => {
      const newMessage = {
          id: crypto.randomUUID(),
          sender: sender,
          text: text,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), newMessage]
      }));
  };

  // Abonelik Ekle
  const addSubscription = (newSub) => {
    const finalImage = newSub.image || getLogoByName(newSub.name);
    
   //uuid
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

    const newNote = {
        id: crypto.randomUUID(),
        type: "success",
        title: "Yeni Abonelik",
        message: `${newSub.name} başarıyla takibe alındı.`,
        time: "Az önce",
        read: false
    };
    setNotifications(prev => [newNote, ...prev]);
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

  // Abonelik Sil 
  const removeSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  // Abonelik İptal Et
  const cancelSubscription = (id) => {
    const subToCancel = subscriptions.find(sub => sub.id === id);
    if(!subToCancel) return;

    setSubscriptions(prev => prev.map(sub => 
        sub.id === id 
            ? { ...sub, status: 'canceled', canceledDate: new Date().toLocaleDateString('tr-TR') } 
            : sub
    ));

    const cancelNote = {
        id: crypto.randomUUID(),
        type: "alert",
        title: "Abonelik İptal Edildi",
        message: `${subToCancel.name} aboneliği iptal edildi. Artık toplam gidere yansımayacak.`,
        time: "Az önce",
        read: false
    };
    setNotifications(prev => [cancelNote, ...prev]);

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

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <GlobalContext.Provider value={{ 
        subscriptions, 
        addSubscription,
        updateSubscription, 
        removeSubscription,
        cancelSubscription, 
        totalExpenses,
        notifications,
        markAllNotificationsAsRead,
        transactions, 
        userSettings,
        updateUserSettings,
        messages,    
        sendMessage,
        spendingLimit,      
        updateSpendingLimit 
    }}>
      {children}
    </GlobalContext.Provider>
  );
};