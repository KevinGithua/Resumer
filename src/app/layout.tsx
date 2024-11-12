"use client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-cyan-100">
        <PayPalScriptProvider options={{ clientId}}>
          <NavBar />
          <main className="">{children}</main>
          <Footer />
        </PayPalScriptProvider>
      </body>
    </html>
  );
};

export default Layout;
