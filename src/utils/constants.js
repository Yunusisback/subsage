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

export const LOGO_MAPPINGS = [
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

export const PLATFORMS = [
  {
      id: "p1",
      name: "Netflix",
      category: "Eğlence",
      price: "199.99",
      color: "red",
      image: SERVICE_LOGOS.NETFLIX
  },
  {
      id: "p2",
      name: "Spotify",
      category: "Müzik",
      price: "59.99",
      color: "green",
      image: SERVICE_LOGOS.SPOTIFY
  },
  {
      id: "p3",
      name: "YouTube Premium",
      category: "Video",
      price: "57.99",
      color: "red",
      image: SERVICE_LOGOS.YOUTUBE
  },
  {
      id: "p4",
      name: "Amazon Prime",
      category: "Alışveriş",
      price: "39.00",
      color: "blue",
      image: SERVICE_LOGOS.AMAZON
  },
  {
      id: "p5",
      name: "Disney+",
      category: "Eğlence",
      price: "134.99",
      color: "blue",
      image: SERVICE_LOGOS.DISNEY
  },
  {
      id: "p6",
      name: "Apple One",
      category: "Paket",
      price: "194.00",
      color: "zinc",
      image: SERVICE_LOGOS.APPLE
  },
  {
      id: "p7",
      name: "iCloud+",
      category: "Bulut",
      price: "12.99",
      color: "sky",
      image: SERVICE_LOGOS.ICLOUD
  },
  {
      id: "p8",
      name: "Exxen",
      category: "Eğlence",
      price: "160.90",
      color: "yellow",
      image: SERVICE_LOGOS.EXXEN
  },
  {
      id: "p9",
      name: "BluTV",
      category: "Eğlence",
      price: "99.90",
      color: "sky",
      image: SERVICE_LOGOS.BLUTV
  },
  {
      id: "p10",
      name: "Xbox Game Pass",
      category: "Oyun",
      price: "159.00",
      color: "green",
      image: SERVICE_LOGOS.XBOX
  },
  {
      id: "p11",
      name: "PlayStation Plus",
      category: "Oyun",
      price: "200.00",
      color: "blue",
      image: SERVICE_LOGOS.PLAYSTATION
  },
  {
      id: "p12",
      name: "Discord Nitro",
      category: "Sosyal",
      price: "104.99",
      color: "purple",
      image: SERVICE_LOGOS.DISCORD
  },
  {
      id: "p13",
      name: "Mubi",
      category: "Film",
      price: "129.00",
      color: "blue",
      image: SERVICE_LOGOS.MUBI
  },
  {
      id: "p14",
      name: "Tod TV",
      category: "Spor",
      price: "249.00",
      color: "purple",
      image: SERVICE_LOGOS.TOD
  },
  {
      id: "p15",
      name: "Gain",
      category: "Eğlence",
      price: "99.00",
      color: "red",
      image: SERVICE_LOGOS.GAIN
  },
  {
      id: "p16",
      name: "Adobe CC",
      category: "Yazılım",
      price: "582.00",
      color: "red",
      image: SERVICE_LOGOS.ADOBE
  },
  {
      id: "p17",
      name: "Canva Pro",
      category: "Tasarım",
      price: "149.00",
      color: "blue",
      image: SERVICE_LOGOS.CANVA
  },
  {
      id: "p18",
      name: "ChatGPT Plus",
      category: "Yapay Zeka",
      price: "650.00",
      color: "green",
      image: SERVICE_LOGOS.CHATGPT
  },
  {
      id: "p19",
      name: "Duolingo",
      category: "Eğitim",
      price: "89.99",
      color: "green",
      image: SERVICE_LOGOS.DUOLINGO
    },
];

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