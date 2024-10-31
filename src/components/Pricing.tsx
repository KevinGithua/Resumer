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
      <main className="pricing px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24" aria-labelledby="pricing-title">
        <h2 id="pricing-title" className="text-center text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-8 text-teal-800">
          Pricing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-20">
          {services.map((service: Service, index: number) => (
            <div
              key={index}
              className="bg-white flex flex-col justify-between p-4 rounded-lg shadow-lg hover:shadow-xl hover:translate-y-[-5px] transition-transform duration-300"
              aria-labelledby={`service-title-${index}`}
            >
              <h3 id={`service-title-${index}`} className="text-lg text-center sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold mb-4 text-teal-500">
                {service.title}
              </h3>
              {service.pricing.map((priceDetail, priceIndex) => (
                <div key={priceIndex} className="flex items-center justify-between p-2 lg:py-3">
                  <p className="text-base sm:text-lg xl:text-xl 2xl:text-3xl font-medium">
                    {priceDetail.category}
                  </p>
                  <p className="text-base sm:text-lg xl:text-xl 2xl:text-3xl text-green-500">
                    ${priceDetail.price.toFixed(2)}
                  </p>
                </div>
              ))}

              <button
                onClick={() => handleOrderNow(service)}
                className="mx-auto bg-teal-500 text-white py-2 px-4 lg:py-3 lg:px-6 xl:py-4 xl:px-8 2xl:py-5 2xl:px-10 rounded-lg hover:bg-teal-600 transition-transform transform hover:translate-y-[-2px] text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
                aria-label={`View details for ${service.title}`}
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
