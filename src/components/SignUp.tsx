"use client";

import { useState, Suspense } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useRouter, useSearchParams } from "next/navigation";
import { app } from "@/lib/firebase";

const auth = getAuth(app);
const database = getDatabase(app);

const SignUpComponent = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName: name });

      // Save user information to the Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, {
        uid: user.uid,
        name,
        phoneNumber,
        email,
        userType: "normal" // Set userType attribute to "normal"
      });

      // Redirect to the page the user was on or profile
      const returnUrl = searchParams.get("returnUrl") || "/profile";
      router.push(returnUrl);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-100 p-4">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded shadow-lg max-w-sm w-full"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-4">
          <span className="text-gray-700 text-sm sm:text-base">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border rounded text-sm sm:text-base"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 text-sm sm:text-base">Phone Number</span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full p-2 border rounded text-sm sm:text-base"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 text-sm sm:text-base">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border rounded text-sm sm:text-base"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 text-sm sm:text-base">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded text-sm sm:text-base"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 text-sm sm:text-base">Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded text-sm sm:text-base"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-300 w-full"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

const SignUp: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading sign up form...</div>}>
      <SignUpComponent />
    </Suspense>
  );
};

export default SignUp;
