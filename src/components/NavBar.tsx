"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { ref, get } from "firebase/database";
import { app, db } from "@/lib/firebase";
import Image from "next/image";
import logo from "@/assets/writerLogo.png";

const auth = getAuth(app);

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, onClick, className }) => (
  <Link
    href={href}
    className={`block px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-medium border-transparent border-b-2 hover:border-pink-500 hover:font-bold ${className || ""}`}
    onClick={onClick}
  >
    {label}
  </Link>
);

const NavBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = ref(db, `admins/${currentUser.uid}`);
        const snapshot = await get(userRef);
        setIsAdmin(snapshot.exists());
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, closeMenu]);

  const authLinks = useMemo(() => (
    <>
      {user ? (
        <>
          <NavLink href="/profile" label="My Account" className="text-purple-600 hover:border-purple-700" onClick={closeMenu} />
          <button
            onClick={handleSignOut}
            className="text-pink-500 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-bold border-transparent border-b-2 hover:border-pink-700 hover:font-bold"
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <NavLink href="/signup" label="Sign Up" className="text-purple-600" onClick={closeMenu} />
          <NavLink href="/login" label="Log In" className="text-pink-500 font-bold" onClick={closeMenu} />
        </>
      )}
    </>
  ), [user, closeMenu, handleSignOut]);

  const renderLinks = useCallback(() => (
    <>
      <NavLink href="/services/resumewriting" label="Resume Writing" onClick={closeMenu} />
      <NavLink href="/services/coverletterwriting" label="Cover Letter" onClick={closeMenu} />
      <NavLink href="/pricing" label="Pricing" onClick={closeMenu} />
      <NavLink href="/contact" label="Contacts" onClick={closeMenu} />
      {isAdmin && <NavLink href="/admin" label="Dashboard" onClick={closeMenu} />}
    </>
  ), [isAdmin, closeMenu]);

  return (
  <nav className="fixed top-0 left-0 right-0 bg-cyan-100 text-cyan-700 py-4 px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 3xl:px-32 flex items-center justify-between z-50 shadow-md max-w-full overflow-hidden">
    {/* Logo and Brand */}
    <Link href="/" className="flex grow items-center space-x-2 flex-shrink-0">
      <Image src={logo} alt="Resumer Logo" height={50} width={50} loading="lazy" /> {/* Increase height/width for larger screens */}
      <span className="text-pink-500 text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-bold hover:text-pink-600">
        <span className="sm:text-2xl">R</span>esumer
      </span>
    </Link>

    {/* Center Links Container for Medium Screens */}
    <div className="hidden md:flex md:justify-center md:space-x-4 lg:hidden">
      <NavLink href="/services" label="Services" onClick={closeMenu} />
      {isAdmin && <NavLink href="/admin" label="Dashboard" onClick={closeMenu} />}
    </div>

    {/* Full Menu for Large Screens */}
    <div className="hidden lg:flex lg:justify-center lg:space-x-4 xl:space-x-6 2xl:space-x-8 3xl:space-x-10">
      {renderLinks()}
    </div>

    {/* Menu Button for Small Screens */}
    <div className="md:hidden flex items-center">
      <button onClick={toggleMenu} className="focus:outline-none">
        <div className="w-6 h-6 flex flex-col justify-between">
          <div className={`h-1 w-full bg-pink-500 transform transition-transform ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
          <div className={`h-1 w-full bg-pink-500 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`h-1 w-full bg-pink-500 transform transition-transform ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </div>
      </button>
    </div>

    {/* Pop-up Menu for Small Screens */}
    {menuOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
        <div
          ref={menuRef}
          className="bg-cyan-100 text-center text-cyan-700 rounded-md py-6 px-4 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-1/2 shadow-lg z-50"
        >
          <ul className="flex flex-col space-y-4">
            {renderLinks()}
            {authLinks}
          </ul>
        </div>
      </div>
    )}

    {/* Auth Actions for Larger Screens */}
    <div className="hidden md:flex items-center space-x-2 sm:space-x-4 lg:space-x-6 xl:space-x-8 2xl:space-x-10">
      {authLinks}
    </div>
  </nav>
);
};

export default NavBar;