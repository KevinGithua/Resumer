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
    const serviceSlug = service.title.toLowerCase().replace(/ /g, '');
    router.push(`/services/${serviceSlug}`);
  };

  return (
    <main className="services min-h-screen px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
      <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-teal-800 mb-6 sm:mb-10 lg:mb-12 xl:mb-16">
        Our Key Services
      </h1>
      <section
        aria-labelledby="services-heading"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-20"
      >
        {servicesData.services.map((service: Service) => (
          <article
            key={service.title}
            className="bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 p-6 sm:p-8 lg:p-10 xl:p-12 2xl:p-14 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
            onClick={() => handleCardClick(service)}
            role="button"
            tabIndex={0}
            aria-label={`Learn more about ${service.title}`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(service);
              }
            }}
          >
            <div className="flex flex-col justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-teal-600 text-center mb-4">
                {service.title}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-700">
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
