"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    // 1️⃣ Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data?.user;

    // 2️⃣ Insert into public.users table
    if (user) {
const { error: dbError } = await supabase
  .from("users")
  .upsert({
    id: user.id,
    name: name,
    email: email,
  });

console.log(dbError);

      if (dbError) {
        console.log(dbError);
        alert(dbError.message);
      }
    }

    setLoading(false);

    alert("Account created successfully!");

    router.push("/dashboard");
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleAuth = async () => {
    if (loading) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">

        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-semibold disabled:bg-gray-600"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700"></div>

          <span className="text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full bg-white text-black p-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-60"
        >
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}

          <a
            href="/login"
            className="text-blue-400 hover:underline"
          >
            Login
          </a>
        </p>

      </div>
    </div>
  );
}