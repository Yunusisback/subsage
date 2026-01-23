import { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: "Netflix",
      price: 199.99,
      currency: "TRY",
      startDate: "2024-02-20",
      category: "Entertainment",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      color: "bg-red-600"
    },
    {
      id: 2,
      name: "Spotify",
      price: 59.99,
      currency: "TRY",
      startDate: "2024-02-25",
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
      image: "https://upload.wikimedia.org/wikipedia/commons/4/41/Amazon_Prime_Logo.svg",
      color: "bg-blue-500"
    },
    {
      id: 4,
      name: "YouTube Premium",
      price: 57.99,
      currency: "TRY",
      startDate: "2024-02-28",
      category: "Video",
      image: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
      color: "bg-red-500"
    },
    {
      id: 5,
      name: "iCloud+",
      price: 12.99,
      currency: "TRY",
      startDate: "2024-03-01",
      category: "Cloud",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      color: "bg-blue-400"
    }
  ]);

  const totalExpenses = subscriptions.reduce((total, sub) => {
    return total + Number(sub.price);
  }, 0);

  const addSubscription = (data) => {
    const newSub = {
      id: uuidv4(),
      ...data,
      price: Number(data.price)
    };
    setSubscriptions([newSub, ...subscriptions]);
  };

  const removeSubscription = (id) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  const value = {
    subscriptions,
    totalExpenses,
    addSubscription,
    removeSubscription
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);