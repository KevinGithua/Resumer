import HomePage from '@/components/Home';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';

// Define metadata using the Metadata API
export const metadata = {
  title: 'Resumer',
  description: 'Get expert help with resume writing, cover letter writing, LinkedIn profile optimization, and job application assistance.',
  keywords: ['resume writing', 'career services', 'LinkedIn optimization', 'cover letter writing', 'job applications, Professional Resume, Career Services'],
  openGraph: {
    title: 'Resumer | Career and Resume Services',
    description: 'Expert resume writing, LinkedIn optimization, and job application assistance to boost your career.',
    url: 'https://your-domain.com',
    siteName: 'Resumer',
    type: 'website',
  },
};

const Page = () => {
  return (
    <div className="flex flex-col gap-6">
      <HomePage />
      <Services />
      <Pricing />
      <Contact />
    </div>
  );
};

export default Page;
