import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const safeJSONParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.warn(`Error parsing ${key} from localStorage, using fallback.`, error);
        return fallback;
    }
};

export const UserProvider = ({ children }) => {
    
    // kullanicı ayarları state
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

    const [spendingLimit, setSpendingLimit] = useState(() => {
        return safeJSONParse("spendingLimit", 15000);
    });

   
    useEffect(() => { localStorage.setItem("userSettings", JSON.stringify(userSettings)); }, [userSettings]);
    useEffect(() => { localStorage.setItem("spendingLimit", JSON.stringify(spendingLimit)); }, [spendingLimit]);

    
    const updateUserSettings = (newSettings) => {
        setUserSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateSpendingLimit = (newLimit) => {
        setSpendingLimit(newLimit);
    };

    return (
        <UserContext.Provider value={{
            userSettings,
            updateUserSettings,
            spendingLimit,
            updateSpendingLimit
        }}>
            {children}
        </UserContext.Provider>
    );
};