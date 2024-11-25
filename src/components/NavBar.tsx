"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { ref, get } from "firebase/database";
import { app, db } from "@/lib/firebase";
import Image from "next/image";
import logo from "@/assets/writerLogo.png";
import { FaUserCircle } from "react-icons/fa";

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
    className={`block px-2 text-sm sm:text-base lg:text-lg xl:text-xl font-medium hover:border-pink-500 hover:border-b-2 hover:font-bold ${className || ""} transform transition-all duration-300 hover:scale-105 ease-in-out`}
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
        <div className="flex items-center justify-between gap-6 font-mono">
          {isAdmin && <NavLink href="/admin" label="Dashboard" onClick={closeMenu} className="text-green-600"/>}
          <Link href="/profile" className="h-10 flex hover:font-bold items-center gap-2 p-2 text-purple-600 transform transition-all duration-300 hover:scale-105 ease-in-out" onClick={closeMenu}>
            <FaUserCircle /> My Account
          </Link>
          <button
            onClick={handleSignOut}
            className="text-rose-500 hover:font-bold  p-2 rounded-lg shadow-lg shadow-rose-200 transform transition-all duration-300 hover:scale-105 ease-in-out"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-6 font-mono">
          <NavLink 
            href="/signup"  
            label="Sign Up" 
            className="text-purple-600 hover:font-bold  p-2 rounded-lg shadow-lg shadow-purple-200 transform transition-all duration-300 hover:scale-105 ease-in-out" 
            onClick={closeMenu} 
          />
          <NavLink 
            href="/login" 
            label="Log In" 
            className="text-pink-500 hover:font-bold  p-2 rounded-lg shadow-lg shadow-pink-200 transform transition-all duration-300 hover:scale-105 ease-in-out" 
            onClick={closeMenu} 
          />
        </div>
      )}
    </>
  ), [user, closeMenu, handleSignOut, isAdmin]);

  const renderLinks = useCallback(() => (
    <>
      <NavLink href="/services" label="Services" onClick={closeMenu} />
      <NavLink href="/services/coverletterwriting" label="Cover Letter" className="hover:border-lime-500" onClick={closeMenu} />
      <NavLink href="/pricing" label="Pricing" onClick={closeMenu} className="hover:border-rose-500" />
      <NavLink href="/contact" label="Contacts" onClick={closeMenu} className="hover:border-violet-500" />
    </>
  ), [closeMenu]);

  return (
  <nav className="fixed max-w-screen-2xl w-full top-0 bg-cyan-50 text-cyan-700 py-4 px-4 sm:px-6 flex items-center justify-between shadow-md overflow-hidden z-50">
    {/* Logo and Brand */}
    <Link href="/" className="flex items-center space-x-2  transform transition-all duration-300 hover:scale-105 ease-in-out">
      <Image src={logo} alt="Resumer Logo" height={50} width={50} loading="lazy" />
      <div>
        <h1 className="text-pink-500 text-center text-4xl lg:text-5xl font-bold">
          <span className=" font-mono">R</span>esumer
        </h1>
      </div>
    </Link>

    {/* Center Links Container for Medium Screens */}
    <div className="hidden sm:flex sm:justify-center sm:space-x-2 lg:hidden">
      <NavLink href="/services" label="Services" onClick={closeMenu} />
    </div>

    {/* Full Menu for Large Screens */}
    <div className="hidden lg:flex lg:justify-center justify-between lg:space-x-2 xl:space-x-6 2xl:space-x-8 3xl:space-x-10">
      {renderLinks()}
    </div>

    {/* Menu Button for Small Screens */}
    <div className="sm:hidden flex items-center text-pink-500">
      <button onClick={toggleMenu} className="focus:outline-none">
          {!menuOpen ? <IoMenu /> : <IoClose />}
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
    <div className="hidden sm:flex itmes-center ml-4 gap-4 text-base lg:text-lg xl:text-xl">
      {authLinks}
    </div>
  </nav>
);
};

export default NavBar;