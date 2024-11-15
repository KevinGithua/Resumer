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
      <div className="landing-content sm:text-left flex flex-col gap-8 items-center sm:items-start justify-between sm:w-2/5">
        <div className='font-bold'>
          <p className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[8rem] pt-10">
            Welcome to 
          </p>
          <h1 className="text-pink-500 py-10 text-5xl sm:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem]">Resumer</h1>
        </div>
        <div className='2xl:pb-10'>
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-5xl text-cyan-500">
            Professional Resume Writing and Revamping Services
          </p>
        </div>
        <div>
        <button
          onClick={handleGetStartedClick}
          aria-label="Get started with our services"
          className="
            cta-button bg-pink-500  text-white 
            px-6 py-3 rounded-lg font-bold 
            text-lg lg:text-xl xl:text-4xl 2xl:text-6xl 
            transition-transform transform 
            hover:-translate-y-1 hover:bg-pink-600  active:bg-pink-700
            focus:outline-none focus:ring-4  focus:ring-pink-300
          "
        >Get Started</button>
      </div>

      </div>

      <div className="image-container flex items-center mb-4 sm:mb-0 2xl:pt-20">
        <div className="flip-container sm:pt-10 ">
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
