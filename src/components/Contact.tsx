"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Head from 'next/head';

interface FormData {
    name: string;
    email: string;
    message: string;
}

const Contact: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post('https://api.web3forms.com/submit', {
                access_key: '8f2a33e0-d57a-448d-8d23-302eeab0c6e0',
                ...formData
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleGoBack = () => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(false);
    };

    return (
        <>
            <Head>
                <title>Contact Us - Resumer | Get in Touch</title>
                <meta name="description" content="Contact Resumer for all your resume writing, cover letter creation, LinkedIn optimization, and job application assistance needs. Reach out to our support team today!" />
                <meta name="keywords" content="contact, resume writing, cover letter writing, LinkedIn optimization, job application assistance, Resumer" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content="Contact Us - Resumer" />
                <meta property="og:description" content="Contact Resumer for your career services, including resume writing, cover letter creation, and LinkedIn optimization. Reach out today!" />
                <meta property="og:image" content="/images/contact-page.png" />
                <meta property="og:url" content="https://your-website.com/contact" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Contact Us - Resumer" />
                <meta name="twitter:description" content="Reach out to Resumer for expert career services, including resume writing, LinkedIn profile optimization, and job application assistance." />
                <meta name="twitter:image" content="/images/contact-page.png" />
            </Head>

            <main className="text-center px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-10 lg:py-12 xl:py-16">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 text-teal-800">Contact Us</h1>
                <div className="flex flex-col lg:flex-row justify-evenly gap-8 lg:gap-12 xl:gap-16">
                    
                    {/* Contact Info */}
                    <article className="flex flex-col justify-evenly w-full text-lg sm:text-xl gap-6 lg:w-1/3">
                        <a href="tel:+254795644422" className="bg-white p-4 sm:p-6 lg:p-8 xl:p-10 rounded-lg shadow-lg flex justify-start items-center space-x-3 transition-transform hover:translate-y-[-10px]" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="text-teal-500 text-2xl xl:text-4xl" aria-label="WhatsApp" />
                            <div className="flex flex-col items-start gap-1">
                                <h3 className="text-teal-500">WhatsApp</h3>
                                <p className="text-teal-800">+254795644422</p>
                            </div>
                        </a>
                        <a href="mailto:nginamiriam2@gmail.com" className="bg-white p-4 sm:p-6 lg:p-8 xl:p-10 rounded-lg shadow-lg flex justify-start items-center space-x-3 transition-transform hover:translate-y-[-10px]" target="_blank" rel="noopener noreferrer">
                            <MdOutlineEmail className="text-teal-500 text-2xl xl:text-4xl" aria-label="Email" />
                            <div className="flex flex-col items-start gap-1">
                                <h3 className="text-teal-500">Email</h3>
                                <p className="text-teal-800">nginamiriam2@gmail.com</p>
                            </div>
                        </a>
                        <a href="https://www.instagram.com/cv91829?igsh=YzhmbXVjZzBienRz" className="bg-white p-4 sm:p-6 lg:p-8 xl:p-10 rounded-lg shadow-lg flex justify-start items-center space-x-3 transition-transform hover:translate-y-[-10px]" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-teal-500 text-2xl xl:text-4xl" aria-label="Instagram" />
                            <div className="flex flex-col items-start gap-1">
                                <h3 className="text-teal-500">Instagram</h3>
                                <p className="text-teal-800">ResumeWriter</p>
                            </div>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100094574041320" className="bg-white p-4 sm:p-6 lg:p-8 xl:p-10 rounded-lg shadow-lg flex items-center justify-start space-x-3 transition-transform hover:translate-y-[-10px]" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF className="text-teal-500 text-2xl xl:text-4xl" aria-label="Facebook" />
                            <div className="flex flex-col items-start gap-1">
                                <h3 className="text-teal-500">Facebook</h3>
                                <p className="text-teal-800">@ResumeWriter</p>
                            </div>
                        </a>
                    </article>
                    
                    {/* Contact Form */}
                    <article className="w-full lg:w-2/3">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-6 text-teal-800">Get in Touch with Support</h2>
                        
                        {submitted ? (
                            <div className="thank-you-message text-teal-800 text-lg sm:text-xl">
                                <p>Thank you for reaching out! We will get back to you shortly.</p>
                                <button
                                    className="go-back-button mt-4 py-2 px-4 sm:py-3 sm:px-6 lg:py-4 lg:px-8 bg-teal-800 text-white rounded-lg"
                                    onClick={handleGoBack}
                                >
                                    Go Back
                                </button>
                            </div>
                        ) : (
                            <form className="bg-white p-4 sm:p-6 lg:p-8 xl:p-10 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                                <div className="form-group mb-4">
                                    <input
                                        placeholder="Your Name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 sm:p-4 border border-teal-300 rounded-lg"
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 sm:p-4 border border-teal-300 rounded-lg"
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <textarea
                                        placeholder="Your Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 sm:p-4 border border-teal-300 rounded-lg resize-none"
                                        rows={5}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 sm:py-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                                >
                                    Submit
                                </button>
                            </form>
                        )}
                    </article>
                </div>
            </main>
        </>
    );
};

export default Contact;
