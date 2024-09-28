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
    <main className="services px-4 sm:px-6 lg:px-8 pt-6 bg-cyan-100 min-h-screen">
      <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl text-teal-800 mb-6 sm:mb-10">Our Key Services</h1>
      <section aria-labelledby="services-heading" className="services-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {servicesData.services.map((service: Service) => (
          <article
            key={service.title}
            className="service-card bg-white rounded-lg shadow-md sm:shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 cursor-pointer"
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
            <h2 className="text-lg sm:text-xl lg:text-2xl text-teal-600 mb-3 sm:mb-4">{service.title}</h2>
            <p className="text-sm sm:text-base text-gray-700">{service.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Services;
