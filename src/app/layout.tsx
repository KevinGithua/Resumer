"use client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Head from "next/head";
import "@/styles/globals.css";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Resumer | Your Path to Career Success</title>
      </Head>
      <body className="bg-cyan-100 font-sans">
        {clientId ? (
          <PayPalScriptProvider options={{ clientId }}>
            <NavBar />
            <main>
              {children}
            </main>
            <Footer />
          </PayPalScriptProvider>
        ) : (
          <div className="text-center p-6">
            <p className="text-red-600 font-bold">
              PayPal client ID is missing. Please configure it in your environment variables.
            </p>
          </div>
        )}
      </body>
    </html>
  );
};

export default Layout;
