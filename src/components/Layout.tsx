// src/app/layout.tsx
import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "@/styles/globals.css"; // Import global styles

export const metadata = {
  title: "Resumer",
  description: "A comprehensive resume building and job application assistance platform",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-cyan-100">
        <NavBar />
        <main className="flex-grow bg-cyan-100 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
