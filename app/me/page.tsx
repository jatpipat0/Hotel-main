"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      // ❌ ถ้ายังไม่ login → กลับหน้าแรก
      router.push("/");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    router.push("/me");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">

        <h1 className="text-3xl font-serif mb-6">My Account</h1>

        <div className="space-y-3 text-left mb-8">
          <p>
            <span className="text-slate-400 text-sm">Name</span>
            <br />
            <span className="text-lg">{user.name || "-"}</span>
          </p>

          <p>
            <span className="text-slate-400 text-sm">Email</span>
            <br />
            <span className="text-lg">{user.email}</span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 transition py-3 rounded-lg text-sm uppercase tracking-widest"
        >
          Logout
        </button>
      </div>
    </div>
  );
}