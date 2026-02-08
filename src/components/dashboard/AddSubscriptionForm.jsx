import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { SERVICE_LOGOS } from "../../utils/constants";
import toast from "react-hot-toast";
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
      setFormData({
        ...initialData,
        startDate: initialData.startDate || new Date().toISOString().split("T")[0]
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData && initialData.image !== SERVICE_LOGOS.DEFAULT) return;
    
    if(!formData.name) return;

    const lowerName = formData.name.toLowerCase();
    let matchedLogo = null;

    if(lowerName.includes("netflix")) matchedLogo = SERVICE_LOGOS.NETFLIX;
    else if(lowerName.includes("spotify")) matchedLogo = SERVICE_LOGOS.SPOTIFY;
    else if(lowerName.includes("youtube")) matchedLogo = SERVICE_LOGOS.YOUTUBE;
    else if(lowerName.includes("prime") || lowerName.includes("amazon")) matchedLogo = SERVICE_LOGOS.AMAZON;
    else if(lowerName.includes("disney")) matchedLogo = SERVICE_LOGOS.DISNEY;
    else if(lowerName.includes("exxen")) matchedLogo = SERVICE_LOGOS.EXXEN;
    else if(lowerName.includes("blutv")) matchedLogo = SERVICE_LOGOS.BLUTV;
    else if(lowerName.includes("xbox")) matchedLogo = SERVICE_LOGOS.XBOX;
    else if(lowerName.includes("playstation")) matchedLogo = SERVICE_LOGOS.PLAYSTATION;
    else if(lowerName.includes("icloud") || lowerName.includes("apple")) matchedLogo = SERVICE_LOGOS.ICLOUD;
    else if(lowerName.includes("tod")) matchedLogo = SERVICE_LOGOS.TOD;
    else if(lowerName.includes("discord")) matchedLogo = SERVICE_LOGOS.DISCORD;
    else if(lowerName.includes("mubi")) matchedLogo = SERVICE_LOGOS.MUBI;
    
    if (matchedLogo) {
        setFormData(prev => ({ ...prev, image: matchedLogo }));
    }

  }, [formData.name, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
   
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

  const handleSubmit = (e) => {
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

    setTimeout(() => {
        if (initialData) {
            updateSubscription(formattedData);
            toast.success("Abonelik güncellendi!");
        } else {
            const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            addSubscription({
                ...formattedData,
                color: randomColor,
            });
        }

        setIsLoading(false);
        if (onSuccess) onSuccess();
    }, 600);
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
              <div className="w-8 h-8 rounded border border-zinc-200 p-1 flex items-center justify-center">
                   <img src={formData.image} alt="Logo Önizleme" className="w-full h-full object-contain" onError={(e) => e.target.style.opacity = 0.5} />
              </div>
              <span>Logo Önizleme</span>
          </div>
      )}

      <div className="pt-4">
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