import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for a confirmation link.");
    setLoading(false);
  };

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Logged in successfully");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={signIn}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <button
            onClick={signUp}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold shadow-md transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Create Account"}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          By signing up, you agree to our{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
