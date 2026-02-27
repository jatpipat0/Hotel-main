"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "เข้าสู่ระบบไม่สำเร็จ");

      // Decode JWT เพื่อดึง role จริงจาก backend
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));

      if (payload.role !== "admin") {
        throw new Error("บัญชีนี้ไม่มีสิทธิ์เข้าใช้งาน Admin");
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token ?? "");
      localStorage.setItem("user", JSON.stringify({
        email: payload.email,
        fullName: payload.fullName ?? payload.email,
        role: payload.role,
      }));

      window.dispatchEvent(new Event("userChanged"));

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setMsg(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-3xl font-serif tracking-[0.25em] text-[#D4AF37]">LUXE</span>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-2">Admin Console</p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-8">
          <h1 className="text-xl font-serif text-white/90 mb-8">เข้าสู่ระบบ Admin</h1>

          {msg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-white/30 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-white/30 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#0D0D0D] py-3.5 text-[11px] uppercase tracking-widest font-bold hover:bg-[#B89146] transition-colors disabled:opacity-50 rounded-lg"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-[11px] text-white/20 hover:text-white/50 transition-colors">
            ← กลับหน้าหลัก
          </Link>
        </div>

      </div>
    </div>
  );
}