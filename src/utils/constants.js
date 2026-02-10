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

export const CURRENCY = {
  TRY: "TRY",
  USD: "USD",
  EUR: "EUR",
};


export const TABS = {
  DASHBOARD: "dashboard",
  SUBSCRIPTIONS: "subscriptions",
  WALLET: "wallet",
  ANALYTICS: "analytics",
  MESSAGES: "messages",
  NOTIFICATIONS: "notifications",
  SETTINGS: "settings",
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
    name: "Exxen",
    price: 160.90,
    currency: "TRY",
    startDate: "2025-01-15", 
    category: "Eğlence",
    image: SERVICE_LOGOS.EXXEN,
    color: "bg-yellow-400"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "success",
    title: "Ödeme Başarılı",
    message: "Netflix abonelik ücretiniz ödendi.",
    time: "2 saat önce",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Yaklaşan Ödeme",
    message: "Spotify ödemeniz yaklaşıyor.",
    time: "5 saat önce",
    read: false,
  }
];