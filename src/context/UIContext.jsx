import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_NOTIFICATIONS } from "../utils/constants";

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

const safeJSONParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.warn(`Error parsing ${key} from localStorage, using fallback.`, error);
        return fallback;
    }
};

export const UIProvider = ({ children }) => {

    
    const [notifications, setNotifications] = useState(() => {
        return safeJSONParse("notifications", INITIAL_NOTIFICATIONS);
    });

  
    const [messages, setMessages] = useState(() => {
        const defaultMessages = {
            1: [ 
                { id: 1, sender: "them", text: "Merhaba Burak Bey, SubSage Destek Ekibi'ne hoş geldiniz. 👋", time: "09:00" },
                { id: 2, sender: "them", text: "Abonelikleriniz veya sistemle ilgili yaşadığınız herhangi bir sorunda size yardımcı olmak için buradayız.", time: "09:00" },
            ]
        };
        return safeJSONParse("messages", defaultMessages);
    });

  
    useEffect(() => { localStorage.setItem("notifications", JSON.stringify(notifications)); }, [notifications]);
    useEffect(() => { localStorage.setItem("messages", JSON.stringify(messages)); }, [messages]); 

    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    
    const sendMessage = (contactId, text, sender = "me") => {
        const newMessage = {
            id: crypto.randomUUID(),
            sender: sender,
            text: text,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), newMessage]
        }));
    };

  
    const addNotification = (title, message, type = "success") => {
        const newNote = {
            id: crypto.randomUUID(),
            type: type,
            title: title,
            message: message,
            time: "Az önce",
            read: false
        };
        setNotifications(prev => [newNote, ...prev]);
    };

    return (
        <UIContext.Provider value={{
            notifications,
            markAllNotificationsAsRead,
            messages,
            sendMessage,
            addNotification
        }}>
            {children}
        </UIContext.Provider>
    );
};