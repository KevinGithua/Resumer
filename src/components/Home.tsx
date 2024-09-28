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
    <div className="main flex flex-col lg:flex-row justify-center items-center text-center lg:text-left min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="landing-content flex flex-col justify-center items-center lg:items-start lg:max-w-full z-20 mb-8 lg:mb-0 lg:w-1/2 px-4 sm:px-6 lg:px-8 lg:mt-[-50px]">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center lg:text-left">
          Welcome to <span className="text-pink-500 text-5xl sm:text-6xl lg:text-8xl">Resumer</span>
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-cyan-500 mb-8">
          Professional Resume Writing and Revamping Services
        </p>
        <button
          onClick={handleGetStartedClick}
          aria-label="Get started with our services"
          className="cta-button bg-cyan-500 text-white mb-10 py-2 px-4 sm:py-4 sm:px-6 text-base lg:text-lg rounded-lg shadow-lg hover:bg-teal-800 hover:-translate-y-1 transition-transform duration-300"
        >
          Get Started
        </button>
      </div>
      <div className="image-container flex justify-center lg:w-1/2 mb-4">
        <div className="flip-container w-full flex justify-center items-start pb-4">
          <Image
            src={mainSample}
            alt="A sample resume showcasing our professional writing services"
            className="rounded-lg animation-flip"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: 'auto',
              maxHeight: '630px',
              maxWidth: '400px',
            }}
            priority // Optimize image loading
          />
        </div>
      </div>
      {/* Add structured data to the head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
};

export default HomePage;
