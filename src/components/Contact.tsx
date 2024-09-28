"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Head from 'next/head';

// TypeScript types
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

            <section className="contact py-6 px-4 bg-cyan-100 text-center">
                <h1 className="text-3xl font-bold mb-8 text-teal-800">Contact Us</h1>
                
                <div className="contact-container flex flex-col lg:flex-row justify-center gap-8">
                    
                    {/* Contact Info */}
                    <article className="contact-info flex flex-col gap-6 md:max-w-md mx-auto w-full">
                        <a href="tel:+254795644422" className="contact-card bg-white p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:translate-y-[-10px]" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="icon text-2xl text-teal-500" aria-label="WhatsApp" />
                            <div>
                                <h2 className="text-teal-500 mb-2">WhatsApp</h2>
                                <p className="text-teal-800">+254795644422</p>
                            </div>
                        </a>
                        <a href="mailto:nginamiriam2@gmail.com" className="contact-card bg-white p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:translate-y-[-10px]" target="_blank" rel="noopener noreferrer">
                            <MdOutlineEmail className="icon text-2xl text-teal-500" aria-label="Email" />
                            <div>
                                <h2 className="text-teal-500 mb-2">Email</h2>
                                <p className="text-teal-800">nginamiriam2@gmail.com</p>
                            </div>
                        </a>
                        <a href="https://www.instagram.com/cv91829?igsh=YzhmbXVjZzBienRz" className="contact-card bg-white p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:translate-y-[-10px]" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="icon text-2xl text-teal-500" aria-label="Instagram" />
                            <div>
                                <h2 className="text-teal-500 mb-2">Instagram</h2>
                                <p className="text-teal-800">ResumeWriter</p>
                            </div>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100094574041320" className="contact-card bg-white p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:translate-y-[-10px]" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF className="icon text-2xl text-teal-500" aria-label="Facebook" />
                            <div>
                                <h2 className="text-teal-500 mb-2">Facebook</h2>
                                <p className="text-teal-800">@ResumeWriter</p>
                            </div>
                        </a>
                    </article>
                    
                    {/* Contact Form */}
                    <article className="chat-section flex-grow max-w-lg mx-auto w-full">
                        <h2 className="text-xl font-semibold mb-4 text-teal-800">Get in Touch with Support</h2>
                        
                        {submitted ? (
                            <div className="thank-you-message text-teal-800 text-lg">
                                <p>Thank you for reaching out! We will get back to you shortly.</p>
                                <button
                                    className="go-back-button mt-4 py-2 px-4 bg-teal-800 text-white rounded-lg"
                                    onClick={handleGoBack}
                                >
                                    Go Back
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                                <div className="form-group mb-4">
                                    <input
                                        placeholder="Your Name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-teal-300 rounded-lg"
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
                                        className="w-full p-3 border border-teal-300 rounded-lg"
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <textarea
                                        placeholder="Your Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-teal-300 rounded-lg resize-none"
                                        rows={5}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                                >
                                    Submit
                                </button>
                            </form>
                        )}
                    </article>
                </div>
            </section>
        </>
    );
};

export default Contact;
