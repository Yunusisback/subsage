import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_SUBSCRIPTIONS, INITIAL_NOTIFICATIONS, SERVICE_LOGOS } from "../utils/constants";

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {

  // İsimden logoyu bul
  const getLogoByName = (name) => {
    if (!name) return SERVICE_LOGOS.DEFAULT;
    const lowerName = name.toLowerCase();
    
    if(lowerName.includes("netflix")) return SERVICE_LOGOS.NETFLIX;
    if(lowerName.includes("spotify")) return SERVICE_LOGOS.SPOTIFY;
    if(lowerName.includes("youtube")) return SERVICE_LOGOS.YOUTUBE;
    if(lowerName.includes("prime") || lowerName.includes("amazon")) return SERVICE_LOGOS.AMAZON;
    if(lowerName.includes("disney")) return SERVICE_LOGOS.DISNEY;
    if(lowerName.includes("exxen")) return SERVICE_LOGOS.EXXEN;
    if(lowerName.includes("blutv")) return SERVICE_LOGOS.BLUTV;
    if(lowerName.includes("xbox")) return SERVICE_LOGOS.XBOX;
    if(lowerName.includes("playstation")) return SERVICE_LOGOS.PLAYSTATION;
    if(lowerName.includes("icloud") || lowerName.includes("apple")) return SERVICE_LOGOS.ICLOUD;
    if(lowerName.includes("tod")) return SERVICE_LOGOS.TOD;
    if(lowerName.includes("discord")) return SERVICE_LOGOS.DISCORD;
    if(lowerName.includes("mubi")) return SERVICE_LOGOS.MUBI;
    if(lowerName.includes("gain")) return SERVICE_LOGOS.GAIN;
    if(lowerName.includes("adobe")) return SERVICE_LOGOS.ADOBE;
    if(lowerName.includes("canva")) return SERVICE_LOGOS.CANVA;
    if(lowerName.includes("chatgpt")) return SERVICE_LOGOS.CHATGPT;
    if(lowerName.includes("duolingo")) return SERVICE_LOGOS.DUOLINGO;
    
    return SERVICE_LOGOS.DEFAULT;
  };

  // state
  const [subscriptions, setSubscriptions] = useState(() => {
    const savedSubs = localStorage.getItem("subscriptions");
    let parsedSubs = savedSubs ? JSON.parse(savedSubs) : INITIAL_SUBSCRIPTIONS;
    

    return parsedSubs.map(sub => ({ 
        ...sub, 
        status: sub.status || 'active',
   
        image: getLogoByName(sub.name) 
    }));
  });

  //  Bildirimler State
  const [notifications, setNotifications] = useState(() => {
    const savedNotes = localStorage.getItem("notifications");
    return savedNotes ? JSON.parse(savedNotes) : INITIAL_NOTIFICATIONS;
  });

  // İşlemler State
  const [transactions, setTransactions] = useState(() => {
    const savedTx = localStorage.getItem("transactions");
    if (savedTx) {

        // İşlemlerin ikonlarını da onar
        const parsedTx = JSON.parse(savedTx);
        return parsedTx.map(tx => ({
            ...tx,
            icon: getLogoByName(tx.name)
        }));
    }
    return INITIAL_SUBSCRIPTIONS.map((sub) => ({
        id: `init-tx-${sub.id}`,
        name: sub.name,
        date: "24 Ocak 2025",
        amount: -parseFloat(sub.price),
        type: "subscription",
        category: sub.category,
        icon: sub.image 
    }));
  });

  // Kullanıcı Ayarları State
  const [userSettings, setUserSettings] = useState(() => {
    const savedSettings = localStorage.getItem("userSettings");
    return savedSettings ? JSON.parse(savedSettings) : {
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
  });

  // Mesajlar State 
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : {
        1: [ 
            { id: 1, sender: "them", text: "Merhaba Burak Bey, SubSage Destek Ekibi'ne hoş geldiniz. 👋", time: "09:00" },
            { id: 2, sender: "them", text: "Abonelikleriniz veya sistemle ilgili yaşadığınız herhangi bir sorunda size yardımcı olmak için buradayız.", time: "09:00" },
        ]
    };
  });

  // localStorage senkronizasyonu
  useEffect(() => { localStorage.setItem("subscriptions", JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem("notifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("userSettings", JSON.stringify(userSettings)); }, [userSettings]);
  useEffect(() => { localStorage.setItem("messages", JSON.stringify(messages)); }, [messages]); 

  // hesaplamalar
  const totalExpenses = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => total + parseFloat(sub.price), 0);

  // Ayar Güncelleme
  const updateUserSettings = (newSettings) => {
      setUserSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Mesaj Gönderme
  const sendMessage = (contactId, text, sender = "me") => {
      const newMessage = {
          id: Date.now(),
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
    
    // Eklerken de logoyu kontrol et
    const finalImage = newSub.image || getLogoByName(newSub.name);
    
    setSubscriptions([...subscriptions, { ...newSub, image: finalImage, id: Date.now(), status: 'active' }]);
    
    const newTransaction = {
      id: Date.now() + 1,
      name: newSub.name,
      date: "Bugün",
      amount: -parseFloat(newSub.price),
      type: "subscription",
      category: newSub.category,
      icon: finalImage
    };
    setTransactions(prev => [newTransaction, ...prev]);

  
    const newNote = {
        id: Date.now() + 2,
        type: "success",
        title: "Yeni Abonelik",
        message: `${newSub.name} başarıyla takibe alındı.`,
        time: "Az önce",
        read: false
    };
    setNotifications(prev => [newNote, ...prev]);
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
        id: Date.now(),
        type: "alert",
        title: "Abonelik İptal Edildi",
        message: `${subToCancel.name} aboneliği iptal edildi. Artık toplam gidere yansımayacak.`,
        time: "Az önce",
        read: false
    };
    setNotifications(prev => [cancelNote, ...prev]);

    const cancelTx = {
        id: `cancel-${Date.now()}`,
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
        removeSubscription,
        cancelSubscription, 
        totalExpenses,
        notifications,
        markAllNotificationsAsRead,
        transactions, 
        userSettings,
        updateUserSettings,
        messages,    
        sendMessage  
    }}>
      {children}
    </GlobalContext.Provider>
  );
};