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
    <main className="flex flex-col sm:flex-row gap-10  xl:gap-0 justify-between itmes-center">
      <div className="landing-content flex flex-col gap-4 items-center sm:items-start justify-between sm:w-2/5">
        <div className='flex flex-col gap-8'>
          <p className="text-3xl font-bold font-mono sm:text-5xl">Welcome to</p>
          <h1 className="text-pink-500 font-semibold text-5xl sm:text-7xl lg:text-8xl xl:text-9xl">Resumer</h1>
        </div>
        <div>
          <p className="  text-cyan-500 font-mono font-semibold">
            Professional Resume Writing and Revamping Services and career consultancy
          </p>
        </div>
        <div>
          <button
            onClick={handleGetStartedClick}
            aria-label="Get started with our services"
            className="
              p-2 sm:px-4 text-pink-500 bg-gradient-to-r from-purple-100 to-cyan-100 hover:text-purple-500 font-semibold rounded-full hover:bg-none hover:scale-105 shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400 
            "
          >Get Started</button>
        </div>
      </div>

      <div className="image-container flex items-center sm:mb-0 ">
        <div className="flip-container sm:mt-8 ">
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
