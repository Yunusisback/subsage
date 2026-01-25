import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);


const INITIAL_SUBSCRIPTIONS = [
  {
    id: 1,
    name: "Netflix",
    price: 199.99,
    currency: "TRY",
    startDate: "2024-01-10",
    category: "Entertainment",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    color: "bg-red-600"
  },
  {
    id: 2,
    name: "Spotify",
    price: 59.99,
    currency: "TRY",
    startDate: "2024-01-20",
    category: "Music",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    color: "bg-green-500"
  },
  {
    id: 3,
    name: "Amazon Prime",
    price: 39.00,
    currency: "TRY",
    startDate: "2024-02-15",
    category: "Shopping",
    image: "https://img.icons8.com/color/144/amazon-prime-video.png",
    color: "bg-blue-500"
  },
  {
    id: 4,
    name: "YouTube Premium",
    price: 57.99,
    currency: "TRY",
    startDate: "2024-03-01",
    category: "Video",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    color: "bg-red-500"
  },
  {
    id: 5,
    name: "iCloud+",
    price: 12.99,
    currency: "TRY",
    startDate: "2024-01-05",
    category: "Cloud",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/ICloud_logo.svg",
    color: "bg-blue-400"
  }
];

 
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "success",
    title: "Ödeme Başarılı",
    message: "Netflix abonelik ücretiniz (199.99₺) başarıyla ödendi. Faturanız e-posta adresinize gönderildi.",
    time: "2 saat önce",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Yaklaşan Ödeme Hatırlatması",
    message: "Spotify ödemeniz 2 gün içinde gerçekleşecek. Lütfen bakiyenizi kontrol edin.",
    time: "5 saat önce",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Yeni Özellik: Raporlar",
    message: "Artık harcama raporlarınızı detaylı PDF olarak indirebilirsiniz.",
    time: "1 gün önce",
    read: true,
  },
  {
    id: 4,
    type: "alert",
    title: "Sistem Bakımı",
    message: "Bu gece 03:00 - 05:00 arası planlı bakım çalışması yapılacaktır. Kesintiler yaşanabilir.",
    time: "2 gün önce",
    read: true,
  },
];

export const GlobalProvider = ({ children }) => {


  const [subscriptions, setSubscriptions] = useState(() => {
    const savedSubs = localStorage.getItem("subscriptions");
    return savedSubs ? JSON.parse(savedSubs) : INITIAL_SUBSCRIPTIONS;
  });

  // Bildirim State 
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Abonelikler her değiştiğinde localStorag a kaydet
  useEffect(() => {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Toplam Gideri Hesapla
  const totalExpenses = subscriptions.reduce((total, sub) => {
    return total + parseFloat(sub.price);
  }, 0);

  const addSubscription = (newSub) => {
    setSubscriptions([...subscriptions, { ...newSub, id: Date.now() }]);
  };

  const removeSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  // Tüm bildirimleri okundu olarak işaretle
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