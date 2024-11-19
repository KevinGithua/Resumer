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
    <main className="flex flex-col sm:flex-row gap-20 2xl:gap-0 justify-between sm:items-start text-center">
      <div className="landing-content sm:text-left flex flex-col gap-8 items-center sm:items-start justify-between sm:w-2/5">
        <div className='font-bold'>
          <p className="text-3xl sm:text-5xl">
            Welcome to 
          </p>
          <h1 className="text-pink-500 text-5xl sm:text-7xl lg:text-8xl xl:text-9xl">Resumer</h1>
        </div>
        <div className='2xl:pb-10'>
          <p className="  text-cyan-500">
            Professional Resume Writing and Revamping Services
          </p>
        </div>
        <div>
        <button
          onClick={handleGetStartedClick}
          aria-label="Get started with our services"
          className="
            cta-button bg-pink-500 
            font-bold  
          "
        >Get Started</button>
      </div>

      </div>

      <div className="image-container flex items-center mb-4 sm:mb-0">
        <div className="flip-container sm:mt-2 ">
          <Image
            src={mainSample}
            alt="A sample resume showcasing our professional writing services"
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
