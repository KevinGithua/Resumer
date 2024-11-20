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
}

const Pricing: React.FC = () => {
  const services: Service[] = servicesData.services.map((service) => ({
    title: service.title,
    description: service.description,
    pricing: service.pricing,
  }));

  const router = useRouter();

  const handleOrderNow = (service: Service) => {
    const formattedSlug = service.title.toLowerCase().replace(/\s+/g, '-');
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

      <main className="pricing">
        <h2 className="text-center text-4xl sm:text-5xl lg:text-6xl text-teal-900 font-extrabold mb-14 tracking-wide">
          Pricing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <article
              key={index}
              className="relative bg-gradient-to-b from-teal-50 to-teal-100 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 p-6 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-500 overflow-hidden flex flex-col"
              aria-labelledby={`service-title-${index}`}
            >
              <h3
                className="text-xl sm:text-2xl text-teal-700 text-center font-semibold mb-6"
                id={`service-title-${index}`}
              >
                {service.title}
              </h3>
              <div className="space-y-4 px-4 flex-grow">
                {service.pricing.map((priceDetail, priceIndex) => (
                  <div
                    key={priceIndex}
                    className="flex justify-between items-center text-teal-800"
                  >
                    <p className="text-lg lg:text-xl font-medium">
                      {priceDetail.category}
                    </p>
                    <p className="text-lg lg:text-xl font-bold text-green-600">
                      ${priceDetail.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              {/* Button at the bottom */}
              <div className='flex justify-center'>
              <button
                onClick={() => handleOrderNow(service)}
                className="mt-4 w-1/2 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400"
                aria-label={`Order ${service.title}`}
              >
                Order Now
              </button>
              </div>
            </article>
          ))}
        </div>
      </main>

    </>
  );
};

export default Pricing;
