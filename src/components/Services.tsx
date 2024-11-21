"use client";

import { useRouter } from 'next/navigation';
import servicesData from '@/assets/servicesData.json';

interface Service {
  title: string;
  description: string;
}

const Services = () => {
  const router = useRouter();

  const handleCardClick = (service: Service) => {
    const serviceSlug = service.title.toLowerCase().replace(/\s+/g, '');
    router.push(`/services/${serviceSlug}`);
  };

  return (
    <main className="services">
      <h1
        id="services-heading"
        className="text-center text-3xl sm:text-4xl lg:text-5xl text-purple-800 font-bold mb-4 sm:mb-8"
      >
        Our Key Services
      </h1>
      <section
        aria-labelledby="services-heading"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {servicesData.services.map((service: Service) => (
          <article
            key={service.title}
            className="relative bg-gradient-to-b from-teal-50 to-teal-100 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 p-8 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-500 overflow-hidden"
            onClick={() => handleCardClick(service)}
            role="button"
            tabIndex={0}
            aria-label={`Learn more about ${service.title}`}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") handleCardClick(service);
            }}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-lg blur-lg opacity-30"></div>
  
            {/* Card Content */}
            <div className="relative z-10">
              <h2 className="text-lg sm:text-2xl text-purple-600 text-center font-semibold mb-4">
                {service.title}
              </h2>
              <p className="text-lg lg:text-xl font-medium">
                {service.description}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );  
};

export default Services;
