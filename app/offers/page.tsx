"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

// --- Mock Data: ข้อมูลโปรโมชั่น (อัปเดตลิงก์รูปภาพใหม่ให้แสดงครบถ้วน) ---
const offersData = [
  {
    id: "offer-1",
    category: "Rooms",
    tag: "STAY",
    title: "Early Bird Privilege",
    description: "วางแผนการเดินทางล่วงหน้าอย่างน้อย 30 วัน รับส่วนลดพิเศษ 20% สำหรับห้องพักทุกประเภท",
    perks: ["ส่วนลดห้องพัก 20%", "อัปเกรดห้องพักฟรี (ขึ้นอยู่กับห้องว่าง)", "เลทเช็คเอาท์ได้ถึง 14:00 น."],
    promoCode: "EARLY20",
    validity: "Valid until 31 Oct 2026",
    isLimited: false,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80", // อัปเดตรูปห้องพักหรู
  },
  {
    id: "offer-2",
    category: "Packages",
    tag: "EXPERIENCE",
    title: "Romantic Getaway",
    description: "ฉลองช่วงเวลาพิเศษกับคนรู้ใจด้วยแพ็กเกจห้อง Suite สุดหรูริมแม่น้ำ",
    perks: ["แชมเปญพรีเมียมต้อนรับ", "ดินเนอร์ใต้แสงเทียน 4 คอร์ส", "สปานวดผ่อนคลาย 90 นาที สำหรับ 2 ท่าน"],
    promoCode: "LOVE26",
    validity: "Valid until 31 Dec 2026",
    isLimited: true,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80", // อัปเดตรูปดินเนอร์ริมทะเล/สระน้ำสุดโรแมนติก
  },
  {
    id: "offer-3",
    category: "Dining",
    tag: "DINING",
    title: "Culinary Journey",
    description: "ดื่มด่ำกับเซ็ตเมนู 5 คอร์ส รังสรรค์โดยเชฟมิชลินสตาร์ เมื่อจองห้องพักตั้งแต่ 2 คืน",
    perks: ["เครดิตทานอาหาร 2,000 บาท", "ไวน์แพริ่ง (Wine Pairing) ทุกคอร์ส", "บริการรถรับส่งสนามบินฟรี"],
    promoCode: "DINEFREE",
    validity: "Valid until 30 Sep 2026",
    isLimited: false,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", // อัปเดตรูปห้องอาหารสุดหรู
  },
  {
    id: "offer-4",
    category: "Spa",
    tag: "WELLNESS",
    title: "Oasis of Serenity",
    description: "ผ่อนคลายความเหนื่อยล้าด้วยแพ็กเกจสปา 120 นาที สำหรับแขกที่เข้าพักวันธรรมดา",
    perks: ["แพ็กเกจสปา ซื้อ 1 แถม 1", "เซ็ตชาออร์แกนิกและขนมเพื่อสุขภาพ", "เข้าใช้ห้องสตีมและซาวน่าฟรี"],
    promoCode: "SPAWELL",
    validity: "Valid until 30 Nov 2026",
    isLimited: true,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80", // รูปสปา
  },
];

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null); // State สำหรับแจ้งเตือนตอนก๊อปปี้โค้ด

  const tabs = ["All", "Rooms", "Packages", "Dining", "Spa"];

  // กรองโปรโมชั่นตาม Tab ที่เลือก
  const filteredOffers = activeTab === "All" 
    ? offersData 
    : offersData.filter(offer => offer.category === activeTab);

  // ฟังก์ชันคัดลอกโค้ด
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // ให้คำว่า Copied! หายไปหลัง 2 วินาที
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FDFCFB] selection:bg-[#B89146] selection:text-white">
      
      <Header />

      {/* --- Hero Section แบบมีภาพพื้นหลัง (Parallax effect เบาๆ) --- */}
      <section className="relative h-[50vh] flex items-center justify-center mt-16">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" 
          alt="Luxury Offers" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="relative z-20 text-center text-white px-4">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-4 font-bold drop-shadow-md">
            LUXE STAY EXCLUSIVES
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide mb-6">
            Special Offers
          </h1>
          <div className="w-16 h-px bg-white/50 mx-auto"></div>
        </div>
      </section>

      {/* --- Main Content --- */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-16 border-b border-[#EAE5D9] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] uppercase tracking-[0.2em] pb-4 relative transition-colors ${
                activeTab === tab 
                  ? "text-[#1A1A1A] font-bold" 
                  : "text-slate-400 hover:text-[#B89146]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B89146] transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="group flex flex-col bg-white border border-[#F0EAD6] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-sm overflow-hidden relative">
              
              {/* Image Container */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/95 backdrop-blur-sm px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A] font-bold shadow-sm">
                    {offer.tag}
                  </span>
                  {offer.isLimited && (
                    <span className="bg-[#B89146] text-white px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-bold shadow-sm animate-pulse">
                      Limited Time
                    </span>
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-8 sm:p-10 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif text-[#1A1A1A] mb-3 group-hover:text-[#B89146] transition-colors">
                  {offer.title}
                </h3>
                <p className="text-sm font-light text-slate-500 leading-relaxed mb-6">
                  {offer.description}
                </p>

                {/* Perks List (ลูกเล่นใหม่: ลิสต์สิทธิประโยชน์) */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {offer.perks.map((perk, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm font-light text-slate-600">
                      <svg className="w-4 h-4 text-[#B89146] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
                
                {/* Promo Code Box & Validity */}
                <div className="bg-[#FAF9F6] border border-[#EAE5D9] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Use Promo Code</span>
                    <span className="font-serif tracking-widest text-lg text-[#1A1A1A] border-b border-dashed border-[#B89146]">{offer.promoCode}</span>
                  </div>
                  <button 
                    onClick={() => handleCopyCode(offer.promoCode, offer.id)}
                    className={`px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-all w-full sm:w-auto ${
                      copiedId === offer.id 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                        : "bg-white border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                    }`}
                  >
                    {copiedId === offer.id ? "Copied!" : "Copy Code"}
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-[#EAE5D9] pt-6">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">
                    {offer.validity}
                  </span>
                  <Link 
                    href="/hotels" 
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#B89146] transition-colors font-bold group/btn"
                  >
                    Book Now
                    <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#0F172A] py-12 text-white/60 mt-auto">
        <div className="mx-auto max-w-7xl px-8 flex flex-col items-center">
          <span className="text-2xl font-serif tracking-[0.2em] text-[#B89146] mb-6">LUXE</span>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest mb-8">
            <Link href="/hotels" className="hover:text-white transition-colors">Destinations</Link>
            <Link href="/offers" className="text-white">Offers</Link>
            <Link href="/me" className="hover:text-white transition-colors">My Bookings</Link>
          </div>
          <div className="w-full max-w-md h-px bg-white/10 mb-8"></div>
          <div className="text-[10px] uppercase tracking-widest">
            © 2026 LUXE STAY GROUP. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

    </div>
  );
}