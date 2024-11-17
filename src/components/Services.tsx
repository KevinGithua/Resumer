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
    <main className="services px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-12 ">
      <h1
        id="services-heading"
        className="text-center text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-teal-800 font-bold mb-10 sm:mb-12 lg:mb-16"
      >
        Our Key Services
      </h1>
      <section
        aria-labelledby="services-heading"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16"
      >
        {servicesData.services.map((service: Service) => (
          <article
            key={service.title}
            className="bg-gradient-to-b from-teal-50 to-teal-100 rounded-lg shadow-md hover:shadow-2xl transform transition-all duration-300 hover:scale-105 p-8 sm:p-10 lg:p-12 xl:p-14 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-500"
            onClick={() => handleCardClick(service)}
            role="button"
            tabIndex={0}
            aria-label={`Learn more about ${service.title}`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleCardClick(service);
            }}
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-teal-600 text-center font-semibold mb-4">
              {service.title}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 text-center leading-relaxed">
              {service.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Services;
