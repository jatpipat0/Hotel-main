"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const router = useRouter();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    setUser(null);

    window.dispatchEvent(new Event("userChanged"));

    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "en", label: "EN" },
    { code: "th", label: "TH" },
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#EAE5D9]/50 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        
        {/* LOGO */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif tracking-[0.2em] text-[#B89146]">LUXE</span>
            <span className="text-2xl font-light tracking-[0.1em] text-slate-300">|</span>
            <span className="text-xl font-light tracking-widest text-[#1A1A1A]">
              Selection
            </span>
          </Link>
        </div>

        {/* MENU */}
        <nav className="hidden md:flex flex-1 justify-center space-x-10 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
          <Link href="/hotels" className="hover:text-[#B89146] transition-colors">
            {t("nav_destinations")}
          </Link>
          <Link href="/offers" className="hover:text-[#B89146] transition-colors">
            {t("nav_offers")}
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex justify-end items-center gap-6">

          {/* ❌ ยังไม่ login */}
          {!user && (
            <div className="hidden sm:flex items-center gap-6 text-[10px] font-medium uppercase tracking-[0.2em]">
              <Link href="/login" className="text-slate-500 hover:text-[#B89146]">
                {t("sign_in")}
              </Link>
              <Link
                href="/register"
                className="bg-[#1A1A1A] text-white px-6 py-3 hover:bg-[#B89146]"
              >
                {t("register")}
              </Link>
            </div>
          )}

          {/* ✅ login แล้ว */}
          {user && (
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em]">
              <span className="text-slate-700">
                👤 {user.fullName || user.email}
              </span>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="bg-[#B89146] text-white px-4 py-2 hover:bg-[#1A1A1A] transition-colors"
                >
                  ⚙ Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                🔓 Logout
              </button>
            </div>
          )}

          {/* LANGUAGE */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-600"
            >
              {languages.find((l) => l.code === lang)?.label}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}