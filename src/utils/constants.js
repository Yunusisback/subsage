
export const SERVICE_LOGOS = {
  NETFLIX: "/brands/netflix.svg",
  SPOTIFY: "/brands/spotify.svg",
  YOUTUBE: "/brands/youtube.svg",
  AMAZON: "/brands/amazon.svg",
  DISNEY: "/brands/disney.svg",
  APPLE: "/brands/apple.svg",
  ICLOUD: "/brands/icloud.svg",
  EXXEN: "/brands/exxen.svg",
  BLUTV: "/brands/blutv.svg",
  XBOX: "/brands/xbox.svg",
  PLAYSTATION: "/brands/playstation.svg",
  DISCORD: "/brands/discord.svg",
  MUBI: "/brands/mubi.svg",
  TOD: "/brands/tod.svg", 
  GAIN: "/brands/gain.svg",
  ADOBE: "/brands/adobe.svg",
  CANVA: "/brands/canva.svg",
  CHATGPT: "/brands/chatgpt.svg",
  DUOLINGO: "/brands/duolingo.svg",
  DEFAULT: "/brands/default.svg" 
};

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
    image: SERVICE_LOGOS.NETFLIX,
    color: "bg-red-600"
  },
  {
    id: 2,
    name: "Spotify",
    price: 59.99,
    currency: "TRY",
    startDate: "2025-01-20", 
    category: "Müzik",
    image: SERVICE_LOGOS.SPOTIFY,
    color: "bg-green-500"
  },
  {
    id: 3,
    name: "Amazon Prime",
    price: 39.00,
    currency: "TRY",
    startDate: "2025-02-15", 
    category: "Alışveriş",
    image: SERVICE_LOGOS.AMAZON,
    color: "bg-blue-500"
  },
  {
    id: 4,
    name: "YouTube Premium",
    price: 57.99,
    currency: "TRY",
    startDate: "2025-03-01", 
    category: "Video",
    image: SERVICE_LOGOS.YOUTUBE,
    color: "bg-red-500"
  },
  {
    id: 5,
    name: "iCloud+",
    price: 12.99,
    currency: "TRY",
    startDate: "2025-01-05", 
    category: "Bulut Servisi",
    image: SERVICE_LOGOS.ICLOUD,
    color: "bg-blue-400"
  },
  {
    id: 6,
    name: "Disney+",
    price: 134.99,
    currency: "TRY",
    startDate: "2025-02-20", 
    category: "Eğlence",
    image: SERVICE_LOGOS.DISNEY,
    color: "bg-blue-900"
  },
  {
    id: 7,
    name: "Xbox Game Pass",
    price: 159.00,
    currency: "TRY",
    startDate: "2025-03-10", 
    category: "Oyun",
    image: SERVICE_LOGOS.XBOX,
    color: "bg-green-600"
  },
  {
    id: 8,
    name: "Exxen",
    price: 160.90,
    currency: "TRY",
    startDate: "2025-01-15", 
    category: "Eğlence",
    image: SERVICE_LOGOS.EXXEN,
    color: "bg-yellow-400"
  },
  {
    id: 9,
    name: "BluTV",
    price: 99.90,
    currency: "TRY",
    startDate: "2025-04-01", 
    category: "Eğlence",
    image: SERVICE_LOGOS.BLUTV,
    color: "bg-sky-500"
  }
];

// Örnek bildirimler
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