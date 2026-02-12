import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { SERVICE_LOGOS, LOGO_MAPPINGS } from "../../utils/constants"; 

import { useData } from "../../context/DataContext"; 

const AddSubscriptionForm = ({ onSuccess, initialData }) => {
  
  const { addSubscription, updateSubscription } = useData();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    startDate: new Date().toISOString().split("T")[0], 
    image: SERVICE_LOGOS.DEFAULT 
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {

      let safeDate = new Date().toISOString().split("T")[0]; 

      if (initialData.startDate) {
          const dateObj = new Date(initialData.startDate);
       
          if (!isNaN(dateObj.getTime())) {
              safeDate = dateObj.toISOString().split("T")[0];
          }
      }

      setFormData({
        ...initialData,
        startDate: safeDate,
    
        price: initialData.price ? initialData.price.toString() : "" 
      });
    }
  }, [initialData]);


  const findLogo = (name) => {
    if (!name) return SERVICE_LOGOS.DEFAULT;
    const lowerName = name.toLowerCase();
    
    const match = LOGO_MAPPINGS.find(item => 
        item.keywords.some(keyword => lowerName.includes(keyword))
    );

    return match ? match.logo : SERVICE_LOGOS.DEFAULT;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
        const newData = { ...prev, [name]: value };

     
        if (name === "name" && (!initialData || initialData.image === SERVICE_LOGOS.DEFAULT)) {
             const detectedLogo = findLogo(value);
           
            
             if (detectedLogo !== SERVICE_LOGOS.DEFAULT) {
                 if (detectedLogo !== prev.image) {
                     newData.image = detectedLogo;
                 }
             } else {
              
                 const cleanName = value.trim().toLowerCase().replace(/\s+/g, '');
                 if (cleanName.length > 2) {
                     newData.image = `https://logo.clearbit.com/${cleanName}.com`;
                 } else {
                     newData.image = SERVICE_LOGOS.DEFAULT;
                 }
             }
        }
        return newData;
    });
   
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Servis adı gereklidir";
    
    
    const cleanPrice = formData.price.toString().replace(',', '.');
    if (!formData.price) {
        newErrors.price = "Fiyat gereklidir";
    } else if (parseFloat(cleanPrice) < 0) {
        newErrors.price = "Fiyat negatif olamaz";
    }

    if (!formData.category.trim()) newErrors.category = "Kategori gereklidir";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    const formattedData = {
        ...formData,
        price: formData.price.toString().replace(',', '.')
    };

    try {
      
     
        await new Promise(resolve => setTimeout(resolve, 300));

        if (initialData) {
        
            await updateSubscription(formattedData);
        } else {
          
            const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            await addSubscription({
                ...formattedData,
                color: randomColor,
            });
        }

        if (onSuccess) onSuccess();

    } catch (error) {
        console.error("İşlem hatası:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
      
          <Input 
            label="Servis Adı" 
            name="name" 
            placeholder="Örn: Netflix, Spotify" 
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            className="focus:bg-cyan-50 focus:ring-cyan-100 focus:border-cyan-300 transition-colors"
          />
          
        
          <div className="grid grid-cols-2 gap-4">
             <Input 
                label="Fiyat (₺)" 
                name="price" 
                type="text"
                placeholder="0.00" 
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                inputMode="decimal"
                className="focus:bg-cyan-50 focus:ring-cyan-100 focus:border-cyan-300 transition-colors"
            />
            <Input 
                label="Kategori" 
                name="category" 
                placeholder="Eğlence, İş..." 
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                className="focus:bg-cyan-50 focus:ring-cyan-100 focus:border-cyan-300 transition-colors"
            />
          </div>

        
          <Input 
            label="Başlangıç Tarihi" 
            name="startDate" 
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="focus:bg-cyan-50 focus:ring-cyan-100 focus:border-cyan-300 transition-colors"
          />

      
           <Input 
            label="Logo URL (Opsiyonel)" 
            name="image" 
            placeholder="https://..." 
            value={formData.image}
            onChange={handleChange}
            className="text-xs focus:bg-cyan-50 focus:ring-cyan-100 focus:border-cyan-300 transition-colors"
          />
      </div>

      {/* Logo Önizleme */}
      {formData.image && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
              <div className="w-8 h-8 rounded border border-zinc-200 p-1 flex items-center justify-center overflow-hidden">
                   <img 
                    src={formData.image} 
                    alt="Logo Önizleme" 
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = SERVICE_LOGOS.DEFAULT;
                   
                    }} 
                   />
              </div>
              <span>Logo Önizleme</span>
          </div>
      )}    <div className="pt-4">
        <Button 
            type="submit" 
            className="w-full text-white bg-cyan-600 hover:bg-cyan-800 shadow-lg shadow-cyan-200 transition-all cursor-pointer "
            isLoading={isLoading}
        >
            {initialData ? "Aboneliği Güncelle" : "Aboneliği Kaydet"}
        </Button>
      </div>
    </form>
  );
};

export default AddSubscriptionForm;