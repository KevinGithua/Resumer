'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import mainSample from '@/assets/mainSample.jpeg';

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Resumer",
  "url": "https://your-domain.com",
  "logo": "https://your-domain.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-234-567-8900",
    "contactType": "Customer Service",
  },
};

const HomePage = () => {
  const router = useRouter();

  const handleGetStartedClick = () => {
    try {
      router.push('/services');
    } catch (error) {
      console.error('Failed to navigate to services:', error);
    }
  };

  return (
    <main className="flex flex-col sm:flex-row gap-20 2xl:gap-0 justify-between sm:items-start text-center min-h-[calc(100vh-64px)] ">
      <div className="landing-content sm:text-left flex flex-col gap-8 items-center sm:items-start justify-between md:w-1/2">
      <div className='font-bold'>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[10rem] pt-10">
          Welcome to <span className="text-pink-500">Resumer</span>
        </h1>
      </div>
      <div className='2xl:py-10'>
        <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-5xl text-cyan-500">
          Professional Resume Writing and Revamping Services
        </p>
      </div>
      <div>
        <button
          onClick={handleGetStartedClick}
          aria-label="Get started with our services"
          className="cta-button text-lg font-bold lg:text-xl xl:text-4xl 2xl:text-6xl hover:-translate-y-1"
        >
          Get Started
        </button>
      </div>
      </div>

      <div className="image-container flex items-center mb-4 sm:mb-0 2xl:pt-20">
        <div className="flip-container ">
          <Image
            src={mainSample}
            alt="A sample resume showcasing our professional writing services"
            className=" 2xl:max-h-max"
            priority
          />
        </div>
      </div>

      {/* Add structured data to the head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
};

export default HomePage;
