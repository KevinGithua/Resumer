"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useRouter, useSearchParams } from "next/navigation";
import { app, db as database } from "@/lib/firebase";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize Firebase auth and database instances
  const auth = useMemo(() => getAuth(app), []);

  // Debounced input handlers
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  // Log in handler
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
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data only once after authentication
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
      </form>
    </div>
  );
};

export default LogIn;
