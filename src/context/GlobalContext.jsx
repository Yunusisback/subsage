import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_SUBSCRIPTIONS, INITIAL_NOTIFICATIONS } from "../utils/constants";

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {

  // states
  const [subscriptions, setSubscriptions] = useState(() => {
    const savedSubs = localStorage.getItem("subscriptions");
    let parsedSubs = savedSubs ? JSON.parse(savedSubs) : INITIAL_SUBSCRIPTIONS;
    return parsedSubs.map(sub => ({ ...sub, status: sub.status || 'active' }));
  });

  //  2. Bildirimler State
  const [notifications, setNotifications] = useState(() => {
    const savedNotes = localStorage.getItem("notifications");
    return savedNotes ? JSON.parse(savedNotes) : INITIAL_NOTIFICATIONS;
  });

  // 3. İşlemler State
  const [transactions, setTransactions] = useState(() => {
    const savedTx = localStorage.getItem("transactions");
    if (savedTx) {
        return JSON.parse(savedTx);
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

  // 4. Kullanıcı Ayarları State
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

  // 5. Mesajlar State 
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

  // hes"aplamalar
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
    setSubscriptions([...subscriptions, { ...newSub, id: Date.now(), status: 'active' }]);
    
    const newTransaction = {
      id: Date.now() + 1,
      name: newSub.name,
      date: "Bugün",
      amount: -parseFloat(newSub.price),
      type: "subscription",
      category: newSub.category,
      icon: newSub.image
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