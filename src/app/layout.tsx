"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-cyan-100 dark:bg-gray-900">
        <PayPalScriptProvider options={{ clientId: "AS-hFV_VUwwW9UwnVXckxpfxQxQxzNs9vO68WhZmJb3ZZDZnBzDWmS3o73GoB8iwa76oAqmVWe1s2duy" }}>
          <NavBar />
          <main className="flex-grow pt-16">{children}</main>
          <Footer />
        </PayPalScriptProvider>
      </body>
    </html>
  );
};

export default Layout;
