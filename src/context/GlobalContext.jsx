import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_SUBSCRIPTIONS, INITIAL_NOTIFICATIONS } from "../utils/constants";

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {

  // abonelik state
  const [subscriptions, setSubscriptions] = useState(() => {
    const savedSubs = localStorage.getItem("subscriptions");
    return savedSubs ? JSON.parse(savedSubs) : INITIAL_SUBSCRIPTIONS;
  });

  // bildirim state
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // localstorage kaydet
  useEffect(() => {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  // toplam gider
  const totalExpenses = subscriptions.reduce((total, sub) => {
    return total + parseFloat(sub.price);
  }, 0);

  // abonelik ekle
  const addSubscription = (newSub) => {
    setSubscriptions([...subscriptions, { ...newSub, id: Date.now() }]);
  };

  // abonelik sil
  const removeSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  // bildirimleri okundu yap
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <GlobalContext.Provider value={{ 
        subscriptions, 
        addSubscription, 
        removeSubscription,
        totalExpenses,
        notifications,
        markAllNotificationsAsRead
    }}>
      {children}
    </GlobalContext.Provider>
  );
};