"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import servicesData from '@/assets/servicesData.json';
import Head from 'next/head';

interface PricingDetail {
  category: string;
  price: number;
}

interface Service {
  title: string;
  description: string;
  pricing: PricingDetail[];
  fields: {
    name: string;
    type: string;
    label: string;
    required: boolean;
  }[];
}

const Pricing: React.FC = () => {
  const { services } = servicesData;
  const router = useRouter();

  const handleOrderNow = (service: Service) => {
    const formattedSlug = service.title.toLowerCase().replace(/\s+/g, '-'); // Use hyphens instead of no spaces
    router.push(`/services/${formattedSlug}`);
  };

  return (
    <>
      <Head>
        <title>Service Pricing | Your Business Name</title>
        <meta name="description" content="Explore our competitive pricing for various services tailored to meet your needs." />
        <meta name="keywords" content="pricing, services, affordable, your business name, cost" />
        <meta name="robots" content="index, follow" />
      </Head>
      <section className="text-center bg-cyan-100 text-teal-800 py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="pricing-title">
        <h2 id="pricing-title" className="text-2xl font-bold mb-8">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((service: Service, index: number) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-lg transition-transform transform hover:translate-y-[-5px] hover:shadow-xl"
              aria-labelledby={`service-title-${index}`}
            >
              <h3 id={`service-title-${index}`} className="text-lg sm:text-xl font-semibold mb-4 text-teal-500">
                {service.title}
              </h3>
              <div className="mb-4">
                {service.pricing.map((priceDetail, priceIndex) => (
                  <p key={priceIndex} className="text-gray-700 text-sm sm:text-base">
                    {priceDetail.category}: ${priceDetail.price.toFixed(2)}
                  </p>
                ))}
              </div>
              <button
                onClick={() => handleOrderNow(service)}
                className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-transform transform hover:translate-y-[-2px] text-sm sm:text-base"
                aria-label={`View details for ${service.title}`} // Improve accessibility
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Pricing;
