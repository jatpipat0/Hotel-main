"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, getErrorMessage } from "@/lib/api-error";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const data = await apiFetch<{
        access_token: string;
        refresh_token: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // ดึง profile มาเก็บ เพื่อให้ Header แสดงชื่อ + ซ่อนปุ่ม login/register
      const profile = await apiFetch<{
        email: string;
        fullName: string;
        role: string;
      }>("/auth/profile");
      localStorage.setItem("user", JSON.stringify(profile));

      window.dispatchEvent(new Event("storage"));
      router.push("/");

    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white selection:bg-[#B89146] selection:text-white">

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80"
          alt="Luxury Resort Pool"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-12">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-wide">
            Welcome Back
          </h2>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 xl:px-24 xl:py-16">
        <div className="mb-auto">
          <Link href="/" className="text-[10px] uppercase tracking-widest text-slate-400">
            ← Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto pt-10 pb-8">
          <h1 className="text-4xl font-serif text-[#1A1A1A] mb-3">Sign In</h1>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-slate-200 py-2 bg-transparent outline-none focus:border-[#B89146]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-slate-200 py-2 bg-transparent outline-none focus:border-[#B89146]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-[#B89146] transition-all duration-300 mt-4 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="mt-auto text-center pb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            New to LUXE STAY?{" "}
            <Link href="/register" className="text-[#B89146] font-bold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}