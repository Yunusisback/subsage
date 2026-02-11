import { useMemo } from 'react';
import { formatMoneyClean } from '../utils/helpers'; 

export const useSpendingAnalysis = (subscriptions, totalExpenses) => {
    
    const activeSubs = useMemo(() => subscriptions.filter(sub => sub.status === 'active'), [subscriptions]);
    const canceledSubs = useMemo(() => subscriptions.filter(sub => sub.status === 'canceled'), [subscriptions]);

    // grafik verisi hesaplama
    const chartData = useMemo(() => {
       
        const allDates = subscriptions
            .map(sub => new Date(sub.startDate))
            .filter(date => !isNaN(date.getTime())) 
            .sort((a, b) => a - b);

        if (allDates.length === 0) return [{ value: 0 }];

        const start = allDates[0];
        const end = new Date();
        const timeline = [];
        let current = new Date(start);

      
        while (current <= end) {
            timeline.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }
       
        if (timeline.length === 0 || timeline[timeline.length - 1] < end) {
            timeline.push(end);
        }

        const data = timeline.map(date => {
        
            const subsActiveAtDate = subscriptions.filter(sub => {
                const startDate = new Date(sub.startDate);
                
          
                let cancelDateObj = null;
                if (sub.status === 'canceled' && sub.canceledDate) {
                     const parsedDate = new Date(sub.canceledDate);
                     if (!isNaN(parsedDate.getTime())) {
                         cancelDateObj = parsedDate;
                     }
                }

                const isStarted = startDate <= date;
               
               
                const isStillActiveAtThisDate = !cancelDateObj || cancelDateObj > date;

                return isStarted && isStillActiveAtThisDate;
            });

            const totalValue = subsActiveAtDate.reduce((acc, sub) => acc + parseFloat(sub.price), 0);
            
        
            return {
                date: date.toLocaleDateString('tr-TR', { month: 'short' }),
                value: totalValue,
                displayValue: totalValue, 
                count: subsActiveAtDate.length
            };
        });

        if (data.length === 1) return [{ ...data[0], date: 'Başlangıç' }, data[0]];
        return data;
    }, [subscriptions]); 

    // Son ayın değişim oranı 
    const growthPercentage = useMemo(() => {
        if (chartData.length < 2) return 0;
        const last = chartData[chartData.length - 1].value;
        const prev = chartData[chartData.length - 2].value;
        if (prev === 0) return last > 0 ? 100 : 0;
        return Math.round(((last - prev) / prev) * 100);
    }, [chartData]);


    // En pahalıyı bul
    const mostExpensive = useMemo(() => {
        if (activeSubs.length === 0) return { name: '-', price: 0 };
        return activeSubs.reduce((prev, current) => {
            return (parseFloat(prev.price) > parseFloat(current.price)) ? prev : current;
        }, activeSubs[0]);
    }, [activeSubs]);

   
    const yearlyProjection = totalExpenses * 12;
    const yearlySavingsTip = mostExpensive.price > 0 
        ? `${mostExpensive.name} iptal edilirse yılda ${formatMoneyClean(mostExpensive.price * 12)}₺ cepte.`
        : "Abonelik ekleyerek tasarruf analizlerini görebilirsin.";

    return {
        activeSubs,
        canceledSubs,
        chartData,
        growthPercentage,
        yearlyProjection,
        yearlySavingsTip
    };
};