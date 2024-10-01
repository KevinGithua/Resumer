"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useRouter, useSearchParams } from "next/navigation";
import { app, db as database } from "@/lib/firebase";

const LogInComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordResetMessage, setPasswordResetMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const auth = useMemo(() => getAuth(app), []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = ref(database, `/users/${user.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      const returnUrl = searchParams.get("returnUrl") || (userData?.role === "admin" ? "/admin" : "/profile");
      router.push(returnUrl);
    } catch (err: any) {
      // Friendly error messages
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    setPasswordResetMessage(null);
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setPasswordResetMessage("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "An error occurred while sending the reset email.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(database, `/users/${user.uid}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();
        router.push(userData?.role === "admin" ? "/admin" : "/profile");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-100 p-4">
      <form
        onSubmit={handleLogIn}
        className="bg-white p-6 md:p-8 rounded shadow-lg max-w-sm w-full space-y-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Log In</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {passwordResetMessage && <p className="text-green-500 mb-4 text-center">{passwordResetMessage}</p>}

        <label className="block mb-4">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </label>

        <button
          type="submit"
          className={`bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors duration-300 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
        </button>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-sm text-blue-500 hover:underline"
          >
            Don&apos;t have an account? Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

const LogIn = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogInComponent />
    </Suspense>
  );
};

export default LogIn;
