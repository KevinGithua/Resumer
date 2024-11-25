"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import servicesData from '@/assets/servicesData.json';
import { FaDollarSign } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";

interface PricingOption {
  category: string;
  price: number;
}

interface Service {
  title: string;
  description: string;
  pricing: PricingOption[];
}

interface ServiceDetailProps {
  params: {
    serviceSlug: string;
  };
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ params }) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const serviceSlug = params.serviceSlug.toLowerCase().replace(/-/g, ' ');
    const service = servicesData.services.find(
      (s: Service) =>
        s.title.toLowerCase().replace(/ /g, '') === serviceSlug.replace(/ /g, '')
    );

    if (service) {
      setSelectedService(service);
    } else {
      router.push('/services'); // Redirect if service not found
    }
  }, [params.serviceSlug, router]);

  useEffect(() => {
    const auth = getAuth(app);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleCategoryChange = (category: string, price: number) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((cat) => cat !== category);
      } else {
        return [...prevCategories, category];
      }
    });

    setTotalPrice((prevPrice) => {
      if (selectedCategories.includes(category)) {
        return prevPrice - price;
      } else {
        return prevPrice + price;
      }
    });
  };

  const handleOrderNow = () => {
    if (!isAuthenticated) {
      // Store the current page URL before redirecting to login
      const currentUrl = window.location.pathname;
      router.push(`/login?redirect=${currentUrl}`);
      return;
    }

    if (selectedService) {
      const formattedSlug = selectedService.title.toLowerCase().replace(/ /g, '_');
      const query = `?categories=${encodeURIComponent(selectedCategories.join(','))}&price=${totalPrice}&title=${encodeURIComponent(selectedService.title)}`;
      router.push(`/order/${formattedSlug}${query}`);
    }
  };

  if (!selectedService) {
    return <div className="text-center text-red-600">Service not found</div>;
  }

return (
  <main className="service-details">
    <h2 className="text-center text-2xl sm:text-4xl font-bold text-fuchsia-800 mb-6 sm:mb-8">
      {selectedService.title}
    </h2>
    <div className="service-detail-content bg-gradient-to-b from-teal-50 to-teal-100 rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto">
      {/* Description */}
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 leading-relaxed">
          {selectedService.description}
        </h3>
      </div>

      {/* Pricing Options */}
      <div>
        {selectedService.pricing.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between m-2 p-2 sm:mx-8 rounded-lg hover:bg-teal-50 transition duration-200"
          >
            <div className='flex flex-col'>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value={item.category}
                  onChange={() => handleCategoryChange(item.category, item.price)}
                  className="form-checkbox h-6 w-6 text-teal-600 border-gray-300 rounded focus:ring-1 focus:ring-teal-400  transition duration-200"
                />
                <span className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium">
                  {item.category}
                </span>
              </label>
            </div>
            <div className="flex items-center text-teal-600 font-bold text-lg sm:text-xl lg:text-2xl">
              <FaDollarSign className="text-xl sm:text-2xl" />
              <span
                className="bg-clip-text text-pink-500"
              >
                {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <p className=" flex justify-center gap-2 text-gray-800 font-semibold text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
        Total Price: 
        <span className=" items-center flex text-teal-600 font-bold space-x-1">
          <FaDollarSign className="text-xl sm:text-2xl" />
          <span
            className="bg-clip-text text-pink-500"
          > {totalPrice} </span>
        </span>
      </p>

      {/* Order Button */}
      <div className="text-center">
        <button
          onClick={handleOrderNow}
          className={`bg-gradient-to-b from-teal-50 to-teal-100 font-medium py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-md hover:bg-none hover:text-pink-500  transition-all duration-300 ${
            selectedCategories.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={selectedCategories.length === 0}
        >
          Order Now
        </button>
      </div>
    </div>
  </main>
);
};

export default ServiceDetail;
