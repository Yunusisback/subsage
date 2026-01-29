export const TABS = {
  DASHBOARD: "dashboard",
  SUBSCRIPTIONS: "subscriptions",
  WALLET: "wallet", 
  REPORTS: "reports",
  MESSAGES: "messages",
  NOTIFICATIONS: "notifications",
  SETTINGS: "settings",
};

export const CURRENCY = {
  TRY: "TRY",
  USD: "USD",
  EUR: "EUR",
};

export const INITIAL_SUBSCRIPTIONS = [
  {
    id: 1,
    name: "Netflix",
    price: 199.99,
    currency: "TRY",
    startDate: "2025-01-10", 
    category: "Eğlence",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    color: "bg-red-600"
  },
  {
    id: 2,
    name: "Spotify",
    price: 59.99,
    currency: "TRY",
    startDate: "2025-01-20", 
    category: "Müzik",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    color: "bg-green-500"
  },
  {
    id: 3,
    name: "Amazon Prime",
    price: 39.00,
    currency: "TRY",
    startDate: "2025-02-15", 
    category: "Alışveriş",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png",
    color: "bg-blue-500"
  },
  {
    id: 4,
    name: "YouTube Premium",
    price: 57.99,
    currency: "TRY",
    startDate: "2025-03-01", 
    category: "Video",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    color: "bg-red-500"
  },
  {
    id: 5,
    name: "iCloud+",
    price: 12.99,
    currency: "TRY",
    startDate: "2025-01-05", 
    category: "Bulut Servisi",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/ICloud_logo.svg",
    color: "bg-blue-400"
  },
  {
    id: 6,
    name: "Disney+",
    price: 134.99,
    currency: "TRY",
    startDate: "2025-02-20", 
    category: "Eğlence",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    color: "bg-blue-900"
  },
  {
    id: 7,
    name: "Xbox Game Pass",
    price: 159.00,
    currency: "TRY",
    startDate: "2025-03-10", 
    category: "Oyun",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Xbox_Game_Pass_logo.svg",
    color: "bg-green-600"
  },
  {
    id: 8,
    name: "Exxen",
    price: 160.90,
    currency: "TRY",
    startDate: "2025-01-15", 
    category: "Eğlence",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Exxen_logo.svg",
    color: "bg-yellow-400"
  },
  {
    id: 9,
    name: "BluTV",
    price: 99.90,
    currency: "TRY",
    startDate: "2025-04-01", 
    category: "Eğlence",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/16/BluTV_Logo.png",
    color: "bg-sky-500"
  }
];

export const INITIAL_NOTIFICATIONS = [
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
  {
    id: 5,
    type: "alert",
    title: "Ödeme Başarısız",
    message: "YouTube Premium ödemesi kart limitiniz yetersiz olduğu için alınamadı. Lütfen kontrol ediniz.",
    time: "3 gün önce",
    read: true,
  },
  {
    id: 6,
    type: "info",
    title: "Fiyat Güncellemesi",
    message: "Disney+ abonelik ücretlerinde %15 artış yapıldı. Yeni fiyatlar önümüzdeki aydan itibaren geçerli olacak.",
    time: "4 gün önce",
    read: true,
  },
  {
    id: 7,
    type: "success",
    title: "Tasarruf İpucu",
    message: "Tebrikler! Geçen aya göre abonelik giderlerinizi %10 azalttınız.",
    time: "1 hafta önce",
    read: true,
  }
];