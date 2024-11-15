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

      <main className="pricing px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-12 min-h-screen ">
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-12 text-teal-800" id="pricing-title">
          Pricing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-teal-50 to-teal-100 flex flex-col justify-between p-6 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-2xl hover:scale-105"
              aria-labelledby={`service-title-${index}`}
            >
              <h3 className="text-center text-2xl lg:text-3xl font-semibold mb-2 text-teal-500" id={`service-title-${index}`}>
                {service.title}
              </h3>
              <div className="space-y-4">
                {service.pricing.map((priceDetail, priceIndex) => (
                  <div key={priceIndex} className="flex justify-between text-teal-800">
                    <p className="text-lg lg:text-xl font-medium">{priceDetail.category}</p>
                    <p className="text-lg lg:text-xl font-semibold text-green-600">${priceDetail.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleOrderNow(service)}
                className="mt-6 mx-auto bg-teal-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-teal-600 transition-all hover:scale-105"
                aria-label={`Order ${service.title}`}
              >
                Click to Order
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Pricing;
