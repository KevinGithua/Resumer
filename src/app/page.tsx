import HomePage from '@/components/Home';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';

// Define metadata using the Metadata API
export const metadata = {
  title: 'Resumer',
  description: 'Get expert help with resume writing, cover letter writing, LinkedIn profile optimization, and job application assistance.',
  keywords: [
    'resume writing',
    'career services',
    'LinkedIn optimization',
    'cover letter writing',
    'job applications',
    'Professional Resume',
    'Career Services',
  ],
  openGraph: {
    title: 'Resumer | Career and Resume Services',
    description: 'Expert resume writing, LinkedIn optimization, and job application assistance to boost your career.',
    url: 'https://your-domain.com',
    siteName: 'Resumer',
    type: 'website',
    images: [
      {
        url: 'https://your-domain.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resumer - Career and Resume Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourTwitterHandle',
    title: 'Resumer | Career and Resume Services',
    description: 'Professional resume writing, LinkedIn profile optimization, and job application assistance.',
    images: ['https://your-domain.com/twitter-image.png'],
  },
};

const Page = () => {
  return (
    <div className="flex flex-col gap-12 ">
      <section aria-labelledby="home-heading">
        <h2 id="home-heading" className="sr-only">Home</h2>
        <HomePage />
      </section>

      <section aria-labelledby="services-heading">
        <h2 id="services-heading" className="sr-only">Our Services</h2>
        <Services />
      </section>

      <section aria-labelledby="pricing-heading">
        <h2 id="pricing-heading" className="sr-only">Pricing</h2>
        <Pricing />
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="sr-only">Contact Us</h2>
        <Contact />
      </section>
    </div>
  );
};

export default Page;
