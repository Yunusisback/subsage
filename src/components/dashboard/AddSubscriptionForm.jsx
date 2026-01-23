import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useGlobal } from "../../context/GlobalContext";

const AddSubscriptionForm = ({ onSuccess }) => {
  const { addSubscription } = useGlobal();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    startDate: new Date().toISOString().split("T")[0], // Bugünün tarihi
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Infobox_info_icon.svg" 
  });

  const [errors, setErrors] = useState({});

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
    if (!formData.price) newErrors.price = "Fiyat gereklidir";
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

    // Yapay bir gecikme 
    setTimeout(() => {

        // Rastgele bir renk ata 
        const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        addSubscription({
            ...formData,
            color: randomColor,
     
        });

        setIsLoading(false);
        if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Servis Adı" 
        name="name" 
        placeholder="Örn: Netflix, Spotify" 
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      
      <div className="grid grid-cols-2 gap-4">
         <Input 
            label="Fiyat (₺)" 
            name="price" 
            type="number"
            placeholder="0.00" 
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
        />
        <Input 
            label="Kategori" 
            name="category" 
            placeholder="Eğlence, İş..." 
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
        />
      </div>

      <Input 
        label="Başlangıç Tarihi" 
        name="startDate" 
        type="date"
        value={formData.startDate}
        onChange={handleChange}
      />

       <Input 
        label="Logo URL (Opsiyonel)" 
        name="image" 
        placeholder="https://..." 
        value={formData.image}
        onChange={handleChange}
        className="text-xs"
      />

      <div className="pt-4">
        <Button 
            type="submit" 
            variant="primary" 
            className="w-full text-black"
            isLoading={isLoading}
        >
            Aboneliği Kaydet
        </Button>
      </div>
    </form>
  );
};

export default AddSubscriptionForm;