"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAddHotelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    hotelName: "",
    price: "",
    location: "",
    description: "",
    rating: "",
    reviews: "",
    stars: "3",
    distanceKm: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let imageUrl = "";

      // 1. อัปโหลดรูปก่อน (ถ้ามี)
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("http://localhost:3001/hotels/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("อัปโหลดรูปไม่สำเร็จ");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      }

      // 2. สร้างโรงแรม
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:3001/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelName: form.hotelName,
          price: Number(form.price),
          location: form.location,
          description: form.description,
          rating: Number(form.rating),
          reviews: Number(form.reviews),
          stars: Number(form.stars) as 3 | 4 | 5,
          distanceKm: Number(form.distanceKm),
          imageUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "เพิ่มโรงแรมไม่สำเร็จ");
      }

      setSuccessMsg("เพิ่มโรงแรมสำเร็จ!");
      setForm({
        hotelName: "", price: "", location: "", description: "",
        rating: "", reviews: "", stars: "3", distanceKm: "",
      });
      setImageFile(null);
      setImagePreview("");

    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Admin Panel</p>
            <h1 className="text-3xl font-serif text-[#1A1A1A]">เพิ่มโรงแรมใหม่</h1>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="text-sm text-slate-500 hover:text-[#B89146] transition-colors"
          >
            ← กลับ
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-6">

          {/* ชื่อโรงแรม */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
              ชื่อโรงแรม *
            </label>
            <input
              name="hotelName"
              value={form.hotelName}
              onChange={handleChange}
              required
              placeholder="เช่น Chiang Mai Riverside Hotel"
              className="w-full border-b border-slate-200 py-2 outline-none focus:border-[#B89146] bg-transparent"
            />
          </div>

          {/* ที่อยู่ */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
              ที่อยู่ / Location *
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="เช่น อ.เมือง เชียงใหม่"
              className="w-full border-b border-slate-200 py-2 outline-none focus:border-[#B89146] bg-transparent"
            />
          </div>

          {/* คำอธิบาย */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
              คำอธิบาย
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="อธิบายโรงแรมโดยย่อ..."
              className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:border-[#B89146] bg-transparent resize-none text-sm"
            />
          </div>

          {/* ราคา + ระยะทาง */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                ราคา / คืน (บาท) *
              </label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="เช่น 2500"
                className="w-full border-b border-slate-200 py-2 outline-none focus:border-[#B89146] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                ระยะทาง (km) *
              </label>
              <input
                name="distanceKm"
                type="number"
                min="0"
                step="0.1"
                value={form.distanceKm}
                onChange={handleChange}
                required
                placeholder="เช่น 1.5"
                className="w-full border-b border-slate-200 py-2 outline-none focus:border-[#B89146] bg-transparent"
              />
            </div>
          </div>

          {/* Stars + Rating + Reviews */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                ดาว *
              </label>
              <select
                name="stars"
                value={form.stars}
                onChange={handleChange}
                className="w-full border-b border-slate-200 py-2 outline-none focus:border-[#B89146] bg-transparent"
              >
                <option value="3">3 ดาว</option>
                <option value="4">4 ดาว</option>
                <option value="5">5 ดาว</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                Rating (0-5) *
              </label>
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                required
                placeholder="เช่น 4.5"
                className="w-full border-b border-slate-200 py-2 outline-none focus:border-[#B89146] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                จำนวน Reviews *
              </label>
              <input
                name="reviews"
                type="number"
                min="0"
                value={form.reviews}
                onChange={handleChange}
                required
                placeholder="เช่น 128"
                className="w-full border-b border-slate-200 py-2 outline-none focus:border-[#B89146] bg-transparent"
              />
            </div>
          </div>

          {/* อัปโหลดรูป */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
              รูปโรงแรม
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleImageChange}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#1A1A1A] file:text-white file:text-xs file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#B89146]"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-40 w-full object-cover rounded-lg border border-slate-200"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white py-4 text-xs uppercase tracking-widest hover:bg-[#B89146] transition-all duration-300 disabled:opacity-50 rounded-lg"
          >
            {loading ? "กำลังบันทึก..." : "เพิ่มโรงแรม"}
          </button>

        </form>
      </div>
    </div>
  );
}