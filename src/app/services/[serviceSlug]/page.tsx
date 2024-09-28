"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import servicesData from '@/assets/servicesData.json';
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
      const formattedSlug = selectedService.title.toLowerCase().replace(/ /g, '');
      const query = `?categories=${encodeURIComponent(selectedCategories.join(','))}&price=${totalPrice}&title=${encodeURIComponent(selectedService.title)}`;
      router.push(`/order/${formattedSlug}${query}`);
    }
  };

  if (!selectedService) {
    return <div className="text-center text-red-600">Service not found</div>;
  }

  return (
    <div className="service-details px-4 sm:px-6 lg:px-8 pt-16 min-h-screen bg-cyan-100">
      <h2 className="text-center text-2xl sm:text-4xl text-teal-800 mb-6">{selectedService.title}</h2>
      <div className="service-detail-content bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800">{selectedService.description}</h3>
        </div>
        <div>
          {selectedService.pricing.map((item, index) => (
            <div key={index} className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={item.category}
                  onChange={() => handleCategoryChange(item.category, item.price)}
                  className="form-checkbox h-5 w-5 text-teal-600"
                />
                <span className="ml-2 text-sm sm:text-base lg:text-lg text-gray-700">
                  {item.category}: ${item.price}
                </span>
              </label>
            </div>
          ))}
        </div>
        <p className="text-gray-800 font-semibold text-lg sm:text-xl lg:text-2xl mb-6">
          Total Price: ${totalPrice}
        </p>
        <button
          onClick={handleOrderNow}
          className={`bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-300 ${
            selectedCategories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={selectedCategories.length === 0}
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default ServiceDetail;
