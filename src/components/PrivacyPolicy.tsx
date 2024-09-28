"use client";

import React from "react";
import Head from "next/head";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-lg shadow-lg mb-10">
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-purple-700 mb-4">{title}</h2>
    {children}
  </div>
);

const PrivacyAndTerms: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy and Terms of Service | Your Business Name</title>
        <meta
          name="description"
          content="Review our privacy policy and terms of service for using our resume writing, cover letter, and job application services."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="text-gray-800 p-6 sm:p-8 lg:p-12 max-w-7xl mx-auto mt-10">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800">
            Our Privacy Policy and Terms of Use
          </h1>
        </div>

        <Section title="Privacy Policy">
          <p className="text-gray-700 mb-4 leading-relaxed">
            We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our services, including resume writing, cover letter writing, LinkedIn optimization, and job application assistance.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1. Data Collection</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We collect personal data such as your name, email address, contact details, and information related to your career history. This data is essential to provide the services you request.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2. Use of Data</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Your data is used to provide personalized services such as resume writing and job application assistance. We do not sell or share your information with third parties without your consent.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">3. Data Security</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We implement industry-standard measures to protect your personal information. However, no system is completely secure, and we cannot guarantee the absolute security of your data.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">4. User Rights</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            You have the right to access, update, or delete your personal data at any time. If you wish to exercise these rights, please contact us.
          </p>
        </Section>

        <Section title="Terms of Service">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            By using our services, you agree to comply with these terms. We reserve the right to update these terms at any time, and your continued use of our services constitutes acceptance of any changes.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2. Services Provided</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We provide professional writing services for resumes, cover letters, LinkedIn profiles, and job applications. The services are tailored based on the information you provide to us.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">3. Payment and Refunds</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Payments for services are due at the time of ordering. If you are not satisfied with our services, you may request a revision. Refunds are provided under specific conditions outlined in our Refund Policy.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">4. User Responsibilities</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            You agree to provide accurate and truthful information for the creation of your documents. You are solely responsible for the content of your resume, cover letter, and other materials.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5. Termination of Service</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We reserve the right to terminate our services to you at any time if you violate these terms or engage in illegal activities using our platform.
          </p>
        </Section>

        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-800 mb-4">
            Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions or concerns regarding this Privacy Policy or Terms of Service, feel free to reach out to us via our contact page or email.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyAndTerms;
