import React from 'react';
import Link from 'next/link';

interface FooterCardProps {
  title: string;
  titleHref: string;
  links: { href: string; text: string }[];
}

const FooterCard: React.FC<FooterCardProps> = ({ title, titleHref, links }) => {
  return (
    <div className="rounded-md  p-10 hover:shadow-xl transform transition-all duration-300 hover:scale-105 ease-in-out">
      <Link href={titleHref} aria-label={`${title} section`} className=''>
        <h4 className="font-semibold font-mono mb-4 text-2xl text-pink-500 cursor-pointer hover:text-pink-600 text-center">{title}</h4>
      </Link>
      <ul className="space-y-2 text-center text-xl">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href} className="hover:text-teal-300" aria-label={link.text}>
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const footerLinks = [
  {
    title: "Get Started",
    titleHref: "/",
    links: [
      { href: "/services/resumewriting", text: "Create Resume" },
      { href: "/pricing", text: "Pricing" },
      { href: "/services", text: "Services" },
      { href: "/privacy-policy", text: "Privacy & Terms" }
    ]
  },
  {
    title: "Resume",
    titleHref: "/services",
    links: [
      { href: "/services/resumewriting", text: "Resume Writing" },
      { href: "/services/resumerevamping", text: "Optimization" },
      { href: "/services/resumerevamping", text: "Revamping" },
      { href: "/services/resumewriting", text: "Pricing" }
    ]
  },
  {
    title: "Other Services",
    titleHref: "/services",
    links: [
      { href: "/services/coverletterwriting", text: "Cover Letter" },
      { href: "/services/coverletterwriting", text: "CL Revamping" },
      { href: "/services/linkedinprofileoptimization", text: "LinkedIn Optimization" },
      { href: "/services/jobapplicationassistance", text: "Application Assistance" }
    ]
  },
  {
    title: "Contacts",
    titleHref: "/contact",
    links: [
      { href: "tel:+254795644422", text: "WhatsApp" },
      { href: "mailto:nginamiriam2@gmail.com", text: "Email" },
      { href: "https://www.instagram.com/cv91829?igsh=YzhmbXVjZzBienRz", text: "Instagram" },
      { href: "https://www.facebook.com/profile.php?id=100094574041320", text: "Facebook" }
    ]
  }
];

const Footer: React.FC = () => {
  return (
    <footer className="w-full mx-auto flex flex-col items-center text-cyan-800 py-4 mt-auto">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10 lg:gap-12 text-sm sm:text-xl">
        {footerLinks.map((card, index) => (
          <FooterCard key={index} title={card.title} titleHref={card.titleHref} links={card.links} />
        ))}
      </div>

      <div className="text-center font-semibold font-mono mt-4">
        <p className='text-xl'>&copy; {new Date().getFullYear()} Resumer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
