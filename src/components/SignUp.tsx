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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // New state for button loading
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true); // Start loading
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
        email,
        userType: "normal" // Set userType attribute to "normal"
      });

      // Redirect to the page the user was on or profile
      const returnUrl = searchParams.get("returnUrl") || "/profile";
      router.push(returnUrl);
    } catch (err: any) {
      handleFirebaseErrors(err.code);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Function to handle Firebase errors
  const handleFirebaseErrors = (errorCode: string) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        setError("This email is already in use. Please log in.");
        break;
      case "auth/invalid-email":
        setError("Please enter a valid email address.");
        break;
      case "auth/weak-password":
        setError("Password should be at least 6 characters.");
        break;
      default:
        setError("An unexpected error occurred. Please try again.");
        break;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-2">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-4 sm:p-10 rounded-lg shadow-lg max-w-sm w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <label className="block mb-2">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            required
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            required
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            required
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            required
          />
        </label>

        <button
          type="submit"
          className={`w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 font-semibold ${
            loading ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?</p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:text-blue-700 transition-colors font-medium mt-2"
          >
            Log In
          </button>
        </div>
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
