import { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useUser } from '../context/UserContext';
import { useUI } from '../context/UIContext';


const getTodayKey = () => {
    const today = new Date();
    return `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
};


const getSentNotifications = () => {
    const todayKey = getTodayKey();
    const stored = localStorage.getItem('sentNotifications');
    
    if (!stored) {
        return { date: todayKey, notifications: [] };
    }
    
    try {
        const parsed = JSON.parse(stored);
      
        if (parsed.date !== todayKey) {
            localStorage.setItem('sentNotifications', JSON.stringify({ date: todayKey, notifications: [] }));
            return { date: todayKey, notifications: [] };
        }
        return parsed;
    } catch {
        return { date: todayKey, notifications: [] };
    }
};


const isNotificationSent = (notificationId) => {
    const sent = getSentNotifications();
    return sent.notifications && sent.notifications.includes(notificationId);
};


const markNotificationAsSent = (notificationId) => {
    const sent = getSentNotifications();
    if (!sent.notifications) {
        sent.notifications = [];
    }
    if (!sent.notifications.includes(notificationId)) {
        sent.notifications.push(notificationId);
        localStorage.setItem('sentNotifications', JSON.stringify(sent));
    }
};


const getDaysDifference = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1).setHours(0, 0, 0, 0);
    const secondDate = new Date(date2).setHours(0, 0, 0, 0);
    return Math.round((secondDate - firstDate) / oneDay);
};


const getNextRenewalDate = (startDate) => {
    try {
        const start = new Date(startDate);
      
        if (isNaN(start.getTime())) {
            return new Date();
        }
        
        const today = new Date();
        
       
        const daysPassed = getDaysDifference(start, today);
        
      
        const cycleLength = 30;
        
        
        const cyclesPassed = Math.floor(daysPassed / cycleLength);
        
        
        const nextRenewal = new Date(start);
        nextRenewal.setDate(nextRenewal.getDate() + ((cyclesPassed + 1) * cycleLength));
        
        return nextRenewal;
    } catch {
        return new Date();
    }
};


const getDaysUntilRenewal = (startDate) => {
    try {
        const nextRenewal = getNextRenewalDate(startDate);
        const today = new Date();
        return getDaysDifference(today, nextRenewal);
    } catch {
        return 30; 
    }
};


const isAnniversary = (startDate) => {
    try {
        const start = new Date(startDate);
       
        if (isNaN(start.getTime())) {
            return false;
        }
        
        const today = new Date();
        const daysPassed = getDaysDifference(start, today);
        
        
        return daysPassed > 0 && daysPassed % 365 === 0;
    } catch {
        return false;
    }
};

export const useNotificationService = () => {
    const { subscriptions, totalExpenses } = useData();
    const { spendingLimit, user } = useUser();
    const { addNotification } = useUI();

    useEffect(() => {

       
        if (!user || !subscriptions || subscriptions.length === 0) {
            return;
        }

       
        const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');

     
        activeSubscriptions.forEach(sub => {
         
            if (!sub.startDate) {
                return;
            }
            
            const daysUntil = getDaysUntilRenewal(sub.startDate);
            
           
            if (daysUntil === 3) {
                const notifId = `renewal-3-${sub.id}-${getTodayKey()}`;
                if (!isNotificationSent(notifId)) {
                    addNotification(
                        "Yaklaşan Ödeme",
                        `${sub.name} aboneliğiniz 3 gün içinde yenilenecek.`,
                        "warning"
                    );
                    markNotificationAsSent(notifId);
                }
            }
         
            if (daysUntil === 1) {
                const notifId = `renewal-1-${sub.id}-${getTodayKey()}`;
                if (!isNotificationSent(notifId)) {
                    addNotification(
                        "Yarın Ödeme Var",
                        `${sub.name} aboneliğiniz yarın yenilenecek.`,
                        "warning"
                    );
                    markNotificationAsSent(notifId);
                }
            }
            
         
            if (daysUntil === 0) {
                const notifId = `renewal-0-${sub.id}-${getTodayKey()}`;
                if (!isNotificationSent(notifId)) {
                    addNotification(
                        "Bugün Ödeme",
                        `${sub.name} aboneliğiniz bugün yenileniyor.`,
                        "info"
                    );
                    markNotificationAsSent(notifId);
                }
            }

        
            if (isAnniversary(sub.startDate)) {
                const yearCount = Math.floor(getDaysDifference(new Date(sub.startDate), new Date()) / 365);
                const notifId = `anniversary-${sub.id}-${yearCount}-${getTodayKey()}`;
                if (!isNotificationSent(notifId)) {
                    addNotification(
                        "🎉 Yıldönümü",
                        `${sub.name} aboneliğiniz ${yearCount} yıl oldu! İptal etmeyi düşünür müsün?`,
                        "info"
                    );
                    markNotificationAsSent(notifId);
                }
            }
        });

      
        if (spendingLimit && spendingLimit > 0) {
            const limitPercentage = (totalExpenses / spendingLimit) * 100;

          
            if (limitPercentage >= 80 && limitPercentage < 90) {
                const notifId = `limit-80-${getTodayKey()}`;
                if (!isNotificationSent(notifId)) {
                    addNotification(
                        "Bütçe Uyarısı",
                        `Aylık bütçe limitinin %${Math.round(limitPercentage)}'ine ulaştın.`,
                        "warning"
                    );
                    markNotificationAsSent(notifId);
                }
            }

            if (limitPercentage >= 90 && limitPercentage < 100) {
                const notifId = `limit-90-${getTodayKey()}`;
                if (!isNotificationSent(notifId)) {
                    addNotification(
                        "Dikkat! Limit Yaklaşıyor",
                        `Bütçe limitinin %${Math.round(limitPercentage)}'ine ulaştın. Dikkatli ol!`,
                        "warning"
                    );
                    markNotificationAsSent(notifId);
                }
            }

          
            if (limitPercentage >= 100) {
                const notifId = `limit-100-${getTodayKey()}`;
                if (!isNotificationSent(notifId)) {
                    addNotification(
                        "Limit Aşıldı!",
                        `Aylık bütçe limitini aştın! Toplam: ${totalExpenses.toFixed(2)}₺`,
                        "alert"
                    );
                    markNotificationAsSent(notifId);
                }
            }
        }

    }, [subscriptions, totalExpenses, spendingLimit, addNotification, user]);
};