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

            <main className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-teal-800 mb-10">Contact Us</h1>
                <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-12 justify-evenly items-center">
                    
                    {/* Contact Info */}
                    <article className="flex flex-col w-full lg:w-2/5 space-y-6 p-6 bg-gradient-to-b from-teal-100 to-teal-50 rounded-lg shadow-lg">
                    <h2 className="text-center text-2xl font-semibold text-teal-800">Our Socials</h2>
                        {[
                            { href: "tel:+254795644422", label: "WhatsApp", value: "+254795644422", icon: <FaWhatsapp /> },
                            { href: "mailto:nginamiriam2@gmail.com", label: "Email", value: "nginamiriam2@gmail.com", icon: <MdOutlineEmail /> },
                            { href: "https://www.instagram.com/cv91829?igsh=YzhmbXVjZzBienRz", label: "Instagram", value: "ResumeWriter", icon: <FaInstagram /> },
                            { href: "https://www.facebook.com/profile.php?id=100094574041320", label: "Facebook", value: "@ResumeWriter", icon: <FaFacebookF /> }
                        ].map((item, idx) => (
                            <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" 
                               className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 hover:bg-teal-50 transition-transform transform hover:scale-105">
                                <div className="text-teal-500 text-3xl">{item.icon}</div>
                                <div>
                                    <h3 className="text-teal-600 text-lg font-semibold">{item.label}</h3>
                                    <p className="text-teal-800">{item.value}</p>
                                </div>
                            </a>
                        ))}
                    </article>
                    
                    {/* Contact Form */}
                    <article className="w-full lg:w-3/5 bg-gradient-to-b from-teal-100 to-teal-50 rounded-lg shadow-lg">
                        
                        {submitted ? (
                            <div className="text-teal-800 text-lg sm:text-xl text-center">
                                <p>Thank you for reaching out! We will get back to you shortly.</p>
                                <button
                                    onClick={handleGoBack}
                                    className="mt-6 px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                                >
                                    Go Back
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className=" p-6 rounded-lg shadow-lg">
                                <h3 className=" text-center text-2xl font-semibold text-teal-800 mb-6">Get in Touch with Support</h3>
                                <div className="mb-5">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-4 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div className="mb-5">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-4 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div className="mb-5">
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-4 border border-teal-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        rows={5}
                                    />
                                </div>
                                <button type="submit" className="w-full py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition">
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
