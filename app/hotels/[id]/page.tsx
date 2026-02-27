"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";

// --- Mock Data (อัปเดตข้อมูลครบทั้ง 6 โรงแรม) ---
const hotelDetails: Record<string, any> = {
  "four-seasons-cnx": {
    name: "Four Seasons Resort Chiang Mai",
    area: "อ.แม่ริม, เชียงใหม่ 50180",
    rating: 4.8,
    reviews: 1452,
    tags: ["ยกเลิกฟรี", "แนะนำ"],
    images: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/1f/8b/a9/four-seasons-resort-chiang.jpg?h=500&s=1&w=900",
      "https://media-cdn.tripadvisor.com/media/photo-s/31/59/34/0e/four-seasons-resort-chiang.jpg",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/54927371.jpg?k=651540451844731592b5407ab461f85fee46727430e61f1eed452b948b3e9324&o="
    ],
    quickAmenities: ["สระว่ายน้ำ", "Wi-Fi ฟรี", "อาหารเช้า", "ที่จอดรถ", "สปา", "ฟิตเนส"],
    description: "สัมผัสประสบการณ์การพักผ่อนเหนือระดับท่ามกลางทุ่งนาเขียวขจีและทิวเขาของแม่ริม Four Seasons Resort Chiang Mai มอบความเป็นส่วนตัวสูงสุดพร้อมบริการระดับเวิลด์คลาส ผสมผสานสถาปัตยกรรมล้านนาเข้ากับความหรูหราสมัยใหม่ได้อย่างลงตัว สร้างความทรงจำที่ไม่อาจลืมเลือน",
    policies: [
      { title: "ยกเลิกฟรี", desc: "ยกเลิกฟรีภายใน 48 ชั่วโมงก่อนเช็คอิน ไม่มีค่าธรรมเนียม", isGood: true },
      { title: "สัตว์เลี้ยง", desc: "ไม่อนุญาตให้นำสัตว์เลี้ยงเข้าพัก เพื่อความสงบของแขกท่านอื่น", isGood: false },
      { title: "สูบบุหรี่", desc: "ห้ามสูบบุหรี่ภายในห้องพัก มีพื้นที่สูบบุหรี่ที่กำหนดไว้บริการ", isGood: false }
    ],
    rooms: [
      { id: "r1", name: "Lanna Pavilion", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์", size: "70 sq.m.", roomAmenities: ["Wi-Fi", "อ่างอาบน้ำ", "วิวสวน"], originalPrice: 22500, price: 18500, tag: "เหลือ 5 ห้อง" },
      { id: "r2", name: "Pool Villa", capacity: "2 ผู้ใหญ่ + 1 เด็ก", bed: "1 เตียงคิงไซส์", size: "350 sq.m.", roomAmenities: ["สระส่วนตัว", "ห้องนั่งเล่น", "เตียงเสริม"], originalPrice: 48000, price: 42000, tag: "ขายดี" },
      { id: "r3", name: "Family Suite", capacity: "4 ผู้ใหญ่", bed: "2 เตียงคิงไซส์", size: "120 sq.m.", roomAmenities: ["Wi-Fi", "2 ห้องน้ำ", "วิวทุ่งนา"], originalPrice: 65000, price: 58000, tag: "" }
    ]
  },
  "anantara-cnx": {
    name: "Anantara Chiang Mai Resort",
    area: "อ.เมือง, เชียงใหม่ 50100",
    rating: 4.7,
    reviews: 2184,
    tags: ["ยกเลิกฟรี", "ริมแม่น้ำ"],
    images: [
      "https://cdn.kiwicollection.com/media/property/PR011161/ll/011161-16-ACHM_Pool_Lotus_Pond_G_A_H.jpg?cb=1475278344",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/a9/f0/a1/colonial-house.jpg?h=500&s=1&w=900",
      "https://media.licdn.com/dms/image/v2/C4E12AQFh3t-LOVRdQQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1605071645743?e=2147483647&t=bw9lWgHAL0PevQWpIBG5qeGXlqwZcZBcIziGimmITW0&v=beta"
    ],
    quickAmenities: ["สระว่ายน้ำ", "Wi-Fi ฟรี", "ริมแม่น้ำ", "สปา", "บาร์"],
    description: "รีสอร์ทหรูริมแม่น้ำปิง ใจกลางเมืองเชียงใหม่ โดดเด่นด้วยดีไซน์ร่วมสมัยที่ออกแบบโดย Kerry Hill อดีตอาคารสถานกงสุลอังกฤษที่ถูกบูรณะอย่างงดงาม",
    policies: [
      { title: "ยกเลิกฟรี", desc: "ยกเลิกได้ฟรีก่อนวันเข้าพัก 7 วัน", isGood: true },
      { title: "สัตว์เลี้ยง", desc: "ไม่อนุญาตให้นำสัตว์เลี้ยงเข้าพัก", isGood: false },
    ],
    rooms: [
      { id: "r1", name: "Deluxe Room", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์", size: "50 sq.m.", roomAmenities: ["Wi-Fi", "ระเบียง", "อ่างอาบน้ำ"], originalPrice: 9500, price: 8200, tag: "ราคาดีที่สุด" },
      { id: "r2", name: "Kasara Suite", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์", size: "105 sq.m.", roomAmenities: ["Wi-Fi", "คลับเลานจ์", "วิวแม่น้ำ"], originalPrice: 19000, price: 16500, tag: "" }
    ]
  },
  "137-pillars": {
    name: "137 Pillars House Chiang Mai",
    area: "ย่านวัดเกต, เชียงใหม่ 50000",
    rating: 4.9,
    reviews: 876,
    tags: ["บูติกโฮเทล", "แนะนำ"],
    images: [
      "https://res.cloudinary.com/pillarshotels/image/upload/f_auto%2Cq_auto/web/cms/resources/gallery/drone-shot-retouched-w2000h2000.jpg",
      "https://res.cloudinary.com/pillarshotels/image/upload/f_auto%2Cq_auto/web/cms/resources/outlet/palette.jpg",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
    ],
    quickAmenities: ["สระว่ายน้ำส่วนตัว", "Wi-Fi ฟรี", "บัตเลอร์", "ห้องอาหารไฟน์ไดน์นิ่ง"],
    description: "ย้อนรอยประวัติศาสตร์ในบ้านไม้สักโบราณอายุกว่า 130 ปี ที่ได้รับการบูรณะอย่างวิจิตรบรรจง 137 Pillars House มอบความเป็นส่วนตัวสูงด้วยห้องสวีทเพียง 30 ห้อง พร้อมบริการบัตเลอร์ส่วนตัวตลอด 24 ชั่วโมง",
    policies: [
      { title: "ยกเลิกฟรี", desc: "ยกเลิกฟรีภายใน 7 วันก่อนเช็คอิน", isGood: true },
      { title: "เวลาเช็คอิน", desc: "เช็คอิน 15:00 น. | เช็คเอาท์ 12:00 น.", isGood: false },
    ],
    rooms: [
      { id: "r1", name: "Rajah Brooke Suite", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์", size: "70 sq.m.", roomAmenities: ["ระเบียงกว้าง", "อ่างอาบน้ำสไตล์วินเทจ", "บัตเลอร์ส่วนตัว"], originalPrice: 15000, price: 12800, tag: "" },
      { id: "r2", name: "East Borneo Suite", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์", size: "75 sq.m.", roomAmenities: ["สระว่ายน้ำส่วนตัว", "วิวสวน", "เครื่องชงกาแฟ"], originalPrice: 20000, price: 17500, tag: "ขายดี" }
    ]
  },
  "raya-heritage": {
    name: "Raya Heritage",
    area: "อ.แม่ริม, เชียงใหม่ 50180",
    rating: 4.8,
    reviews: 645,
    tags: ["Eco-Luxury", "ริมแม่น้ำ"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/277971178.jpg?k=9d7d03f2b5475c75c4ad2b0ecdfe621f8b8eb325eab64071ab64b411899875de&o=",
      "https://www.rayaheritage.com/en/images/kk1.jpg",
      "https://static-new.lhw.com/HotelImages/Final/LW2862/lw2862_100097211_790x490.jpg"
    ],
    quickAmenities: ["สระว่ายน้ำ", "Wi-Fi ฟรี", "สปา", "รถรับส่งฟรี", "ริมแม่น้ำปิง"],
    description: "โรงแรมคอนเซ็ปต์ Eco-Luxury ที่ได้รับแรงบันดาลใจจากวิถีชีวิตริมน้ำของชาวล้านนา เน้นการใช้วัสดุธรรมชาติและงานหัตถกรรมท้องถิ่น ให้ความรู้สึกผ่อนคลายและเข้าถึงธรรมชาติอย่างแท้จริง",
    policies: [
      { title: "เด็กเข้าพัก", desc: "โรงแรมสงวนสิทธิ์ไม่รับเด็กอายุต่ำกว่า 12 ปี", isGood: false },
      { title: "ยกเลิกฟรี", desc: "ยกเลิกได้ฟรีก่อนวันเข้าพัก 3 วัน", isGood: true },
    ],
    rooms: [
      { id: "r1", name: "Rin Terrace Suite", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์", size: "75 sq.m.", roomAmenities: ["ระเบียงริมน้ำ", "อ่างอาบน้ำ", "วิวแม่น้ำ"], originalPrice: 11000, price: 9500, tag: "ราคาพิเศษ" },
      { id: "r2", name: "Kraam Pool Suite", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์", size: "100 sq.m.", roomAmenities: ["สระว่ายน้ำส่วนตัว", "วิวสวน", "มินิบาร์ฟรี"], originalPrice: 16000, price: 14200, tag: "" }
    ]
  },
  
  // --- เปลี่ยนเป็น chiang-mai-marriott ตามที่ร้องขอ ---
  "chiang-mai-marriott": {
    name: "Chiang Mai Marriott Hotel",
    area: "ช้างคลาน, เชียงใหม่ 50100",
    rating: 4.6,
    reviews: 3512,
    tags: ["สำหรับครอบครัว", "ใจกลางเมือง"],
    images: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/2a/55/12/hotel-exterior.jpg?w=900&h=500&s=1",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/23/2a/bf/swimming-pool.jpg?h=-1&s=1&w=700",
      "https://www.thewangbar.com/resourcefiles/homeimages/the-wang-bar-counter.jpg"
    ],
    quickAmenities: ["สระว่ายน้ำใหญ่", "สปา (CHI)", "คิดส์คลับ", "ห้องอาหารจีน"],
    description: "โรงแรมหรูระดับ 5 ดาวใจกลางเมืองเชียงใหม่ ใกล้ไนท์บาซาร์ โดดเด่นด้วยสระว่ายน้ำที่ใหญ่ที่สุดในเชียงใหม่ พร้อมสวนร่มรื่น สปา CHI The Spa และบริการที่เหมาะสำหรับครอบครัว",
    policies: [
      { title: "ยกเลิกฟรี", desc: "ยกเลิกได้ฟรีก่อน 18:00 น. ของวันเข้าพัก", isGood: true },
      { title: "เตียงเสริม", desc: "สามารถขอเตียงเสริมได้ (มีค่าใช้จ่ายเพิ่มเติม)", isGood: false },
    ],
    rooms: [
      { id: "r1", name: "Deluxe Room", capacity: "2 ผู้ใหญ่ + 1 เด็ก", bed: "1 เตียงคิงไซส์", size: "43 sq.m.", roomAmenities: ["Wi-Fi", "อ่างอาบน้ำ", "วิวเมือง"], originalPrice: 6500, price: 5500, tag: "" },
      { id: "r2", name: "Horizon Club Room", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์", size: "43 sq.m.", roomAmenities: ["สิทธิ์เข้าใช้เลานจ์", "เครื่องดื่มฟรี", "เช็คเอาท์เลท"], originalPrice: 9500, price: 8500, tag: "คลับสิทธิพิเศษ" }
    ]
  },
  "melia-cnx": {
    name: "Meliá Chiang Mai",
    area: "ช้างคลาน, เชียงใหม่ 50100",
    rating: 4.7,
    reviews: 1120,
    tags: ["City Center", "Rooftop Bar"],
    images: [
      "https://images.trvl-media.com/lodging/3000000/2430000/2420800/2420707/16bb5868.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/96/1c/dc/bar.jpg?h=500&s=1&w=900",
      "https://ak-d.tripcdn.com/images/1i63g22349svcxk6oA6EC_W_400_0_R5_Q90.jpg?proc=resize%2Fm_z%2Cw_375%2Ch_0%3Bformat%2Ff_webp%2C9C2E"
    ],
    quickAmenities: ["รูฟท็อปบาร์ (Mai The Sky Bar)", "สระว่ายน้ำ", "สปา (YHI)", "คิดส์คลับ"],
    description: "โรงแรมหรูสไตล์สเปนแห่งแรกในภาคเหนือ โดดเด่นด้วย Mai The Sky Bar รูฟท็อปบาร์ที่สูงที่สุดในเชียงใหม่ มอบวิวพาโนรามาของดอยสุเทพและแม่น้ำปิง พร้อมการตกแต่งที่ผสมผสานวัฒนธรรมสเปนและล้านนา",
    policies: [
      { title: "ยกเลิกฟรี", desc: "ยกเลิกฟรีภายใน 48 ชั่วโมงก่อนเช็คอิน", isGood: true },
      { title: "เวลาเช็คอิน", desc: "เช็คอิน 15:00 น. | เช็คเอาท์ 12:00 น.", isGood: false },
    ],
    rooms: [
      { id: "r1", name: "Meliá Room", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์ / 2 เตียงเดี่ยว", size: "30 sq.m.", roomAmenities: ["Wi-Fi", "สมาร์ททีวี", "วิวเมือง"], originalPrice: 5500, price: 4800, tag: "ราคาประหยัด" },
      { id: "r2", name: "The Level Suite", capacity: "2 ผู้ใหญ่", bed: "1 เตียงคิงไซส์", size: "62 sq.m.", roomAmenities: ["สิทธิ์เข้า The Level Lounge", "อ่างอาบน้ำทรงกลม", "วิวภูเขา"], originalPrice: 10500, price: 9200, tag: "เหลือ 2 ห้อง" }
    ]
  }
};

// Fallback กันเหนียว (เผื่อเปิด URL ผิด)
const fallbackHotel = {
  ...hotelDetails["four-seasons-cnx"],
  name: "Chiang Mai Marriott Hotel",
};

function formatBaht(n: number) {
  return new Intl.NumberFormat("th-TH").format(Math.max(0, Math.round(n)));
}

export default function HotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.id as string;
  const hotel = hotelDetails[hotelId] || fallbackHotel;

  const [activeTab, setActiveTab] = useState<"details" | "amenities" | "policies">("details");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const selectedRoom = hotel.rooms.find((r: any) => r.id === selectedRoomId);
  const taxAndFee = selectedRoom ? selectedRoom.price * 0.17 : 0;
  const totalPrice = selectedRoom ? selectedRoom.price + taxAndFee : 0;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-[#B89146] selection:text-white pb-32">
      <Header />

      {/* --- 1. Image Gallery --- */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-32 mb-10">
        <Link href="/" className="inline-flex items-center text-[11px] uppercase tracking-widest text-slate-500 hover:text-[#B89146] mb-6 transition-colors font-medium">
          <span className="mr-2">←</span> กลับไปหน้าค้นหา
        </Link>
        
        <div className="flex h-[300px] md:h-[450px] gap-2 rounded-sm overflow-hidden bg-slate-100">
          <div className="w-full md:w-2/3 h-full relative group">
            <img src={hotel.images[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>
          <div className="hidden md:flex w-1/3 flex-col gap-2 h-full">
            <div className="h-1/2 w-full relative group overflow-hidden">
              <img src={hotel.images[1]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </div>
            <div className="h-1/2 w-full relative group overflow-hidden">
              <img src={hotel.images[2]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer">
                <span className="text-white text-[10px] uppercase tracking-widest border border-white px-5 py-2">ดูรูปทั้งหมด</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. Main Content Layout --- */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- ฝั่งซ้าย --- */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* ข้อมูลหัวเรื่อง */}
          <div>
            <div className="flex gap-2 mb-4">
              {hotel.tags.map((tag: string, idx: number) => (
                <span key={idx} className="bg-[#FAF9F6] border border-[#B89146] text-[#B89146] px-3 py-1 text-[10px] font-bold">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-3 leading-tight">{hotel.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-1.5">
                <span className="text-[#D4AF37] text-[14px]">★★★★★</span> 
                <span className="text-[#1A1A1A] font-bold">{hotel.rating}</span> 
                <span className="text-slate-500 font-light">({hotel.reviews})</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
              <div className="flex items-center gap-1.5 text-slate-500 font-light text-[13px]">
                <svg className="w-4 h-4 text-[#B89146]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {hotel.area}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 border-b border-[#EAE5D9] pb-6">
              {hotel.quickAmenities.map((am: string, idx: number) => (
                <div key={idx} className="flex items-center gap-1.5 text-[12px] text-slate-600">
                  <span className="text-[#B89146]">✓</span> {am}
                </div>
              ))}
            </div>
          </div>

          {/* แถบเมนู Tabs */}
          <div>
            <div className="flex gap-8 border-b border-[#EAE5D9]">
              <button onClick={() => setActiveTab("details")} className={`pb-4 text-[13px] font-medium transition-colors relative ${activeTab === "details" ? "text-[#B89146]" : "text-slate-500 hover:text-[#1A1A1A]"}`}>
                รายละเอียด
                {activeTab === "details" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B89146]"></span>}
              </button>
              <button onClick={() => setActiveTab("amenities")} className={`pb-4 text-[13px] font-medium transition-colors relative ${activeTab === "amenities" ? "text-[#B89146]" : "text-slate-500 hover:text-[#1A1A1A]"}`}>
                สิ่งอำนวยความสะดวก
                {activeTab === "amenities" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B89146]"></span>}
              </button>
              <button onClick={() => setActiveTab("policies")} className={`pb-4 text-[13px] font-medium transition-colors relative ${activeTab === "policies" ? "text-[#B89146]" : "text-slate-500 hover:text-[#1A1A1A]"}`}>
                นโยบาย
                {activeTab === "policies" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B89146]"></span>}
              </button>
            </div>
            <div className="py-6 min-h-[120px]">
              {activeTab === "details" && <p className="text-[14px] font-light text-slate-600 leading-loose">{hotel.description}</p>}
              {activeTab === "amenities" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.quickAmenities.map((am: string, idx: number) => (
                    <div key={idx} className="text-[14px] font-light text-slate-600">• {am}</div>
                  ))}
                </div>
              )}
              {activeTab === "policies" && (
                <div className="space-y-4">
                  {hotel.policies.map((pol: any, idx: number) => (
                    <div key={idx} className={`border p-5 rounded-sm flex flex-col gap-1 ${pol.isGood ? 'border-[#B89146]/30 bg-[#FAF9F6]' : 'border-[#EAE5D9] bg-white'}`}>
                      <div className="flex items-center gap-2">
                        {pol.isGood ? <span className="text-[#B89146]">✓</span> : <span className="text-slate-400">ℹ</span>}
                        <h4 className={`text-[14px] font-bold ${pol.isGood ? 'text-[#B89146]' : 'text-[#1A1A1A]'}`}>{pol.title}</h4>
                      </div>
                      <p className="text-[13px] text-slate-500 font-light pl-6">{pol.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- ตารางเลือกห้องพัก --- */}
          <section>
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              ประเภทห้องพัก
            </h2>
            
            <div className="border border-[#EAE5D9] bg-white rounded-[4px] overflow-hidden flex flex-col shadow-sm">
              <div className="hidden md:grid grid-cols-12 bg-[#FAF9F6] border-b border-[#EAE5D9] px-5 py-3 text-[11px] font-bold text-slate-500 tracking-wide">
                <div className="col-span-4">ประเภทห้อง</div>
                <div className="col-span-2 text-center">ความจุ</div>
                <div className="col-span-3">สิ่งอำนวยความสะดวก</div>
                <div className="col-span-3 text-right">ราคาต่อคืน</div>
              </div>

              <div className="divide-y divide-[#EAE5D9]">
                {hotel.rooms.map((room: any) => (
                  <div key={room.id} className={`grid grid-cols-1 md:grid-cols-12 px-5 py-4 items-center gap-4 md:gap-0 transition-colors ${selectedRoomId === room.id ? 'bg-[#FAF9F6] ring-1 ring-inset ring-[#B89146]' : 'hover:bg-slate-50'}`}>
                    
                    <div className="col-span-4 flex flex-col items-start pr-4">
                      <h3 className="text-[14px] font-serif text-[#1A1A1A] font-bold leading-tight">{room.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{room.size}</p>
                      {room.tag && <span className="inline-block mt-1.5 text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100">{room.tag}</span>}
                    </div>

                    <div className="col-span-2 flex items-center md:justify-center gap-1.5 text-[11px] text-slate-600">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      {room.capacity}
                    </div>

                    <div className="col-span-3 flex flex-wrap gap-1">
                      {room.roomAmenities.map((am: string, i: number) => (
                        <span key={i} className="bg-white text-slate-600 px-1.5 py-0.5 text-[9px] rounded-sm border border-slate-200">
                          {am}
                        </span>
                      ))}
                    </div>

                    <div className="col-span-3 flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end gap-1">
                      <div className="flex flex-col items-start md:items-end leading-none">
                        <span className="text-[10px] text-slate-400 line-through mb-0.5">฿{formatBaht(room.originalPrice)}</span>
                        <span className="text-[18px] font-serif text-[#B89146] font-medium">฿{formatBaht(room.price)}</span>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`mt-1.5 px-4 py-2 text-[10px] font-bold rounded-sm transition-colors w-full md:w-auto min-w-[100px] ${
                          selectedRoomId === room.id 
                            ? "bg-[#1A1A1A] text-white border border-[#1A1A1A]" 
                            : "bg-white text-[#1A1A1A] border border-[#EAE5D9] hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                        }`}
                      >
                        {selectedRoomId === room.id ? "เลือกแล้ว ✓" : "เลือกห้องนี้"}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* --- ฝั่งขวา: กล่องสรุปการจอง --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white border border-[#EAE5D9] shadow-lg p-6 rounded-[8px]">
            
            <h3 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2 mb-4 border-b border-[#EAE5D9] pb-4">
              <svg className="w-5 h-5 text-[#B89146]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              สรุปการจอง
            </h3>
            
            <div className="bg-[#FAF9F6] border border-[#EAE5D9] rounded-sm p-4 text-[13px] text-slate-600 mb-6 space-y-3">
              <div className="flex justify-between">
                <span>เช็คอิน</span>
                <span className="font-bold text-[#1A1A1A]">20 ม.ค. 2026</span>
              </div>
              <div className="flex justify-between">
                <span>เช็คเอาท์</span>
                <span className="font-bold text-[#1A1A1A]">22 ม.ค. 2026</span>
              </div>
              <div className="flex justify-between border-t border-[#EAE5D9] pt-3 mt-1">
                <span>จำนวน</span>
                <span className="font-bold text-[#1A1A1A]">2 คืน • 1 ห้อง</span>
              </div>
            </div>

            <div className={`border p-4 mb-6 rounded-sm transition-colors ${selectedRoom ? 'border-[#B89146] bg-amber-50/50' : 'border-dashed border-slate-300 bg-slate-50'}`}>
              <p className="text-[11px] text-slate-500 mb-1 font-medium">ห้องที่เลือก</p>
              <p className={`text-[14px] font-bold ${selectedRoom ? 'text-[#1A1A1A]' : 'text-slate-400'}`}>
                {selectedRoom ? selectedRoom.name : "กรุณาเลือกประเภทห้องพักจากด้านซ้าย"}
              </p>
            </div>

            {selectedRoom && (
              <div className="space-y-3 text-[13px] mb-6 animate-fade-in-up">
                <div className="flex justify-between text-slate-600">
                  <span>ราคาห้องพัก (2 คืน)</span>
                  <span>฿{formatBaht(selectedRoom.price * 2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[12px]">
                  <span>ภาษีและค่าธรรมเนียม (17%)</span>
                  <span>฿{formatBaht(taxAndFee * 2)}</span>
                </div>
                <div className="flex justify-between items-end border-t border-[#EAE5D9] pt-4 mt-2">
                  <span className="text-[14px] font-bold text-[#1A1A1A]">ราคารวมทั้งหมด</span>
                  <span className="text-2xl font-bold text-[#B89146]">฿{formatBaht((totalPrice) * 2)}</span>
                </div>
              </div>
            )}

            <button 
              onClick={() => router.push('/confirm')}
              disabled={!selectedRoom}
              className={`w-full py-3.5 text-[14px] font-bold rounded-[6px] transition-all flex justify-center items-center gap-2 ${
                selectedRoom 
                  ? "bg-[#1A1A1A] text-white hover:bg-[#B89146] shadow-md cursor-pointer" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              ไปชำระเงิน
              {selectedRoom && <span>→</span>}
            </button>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center">
              <svg className="w-3 h-3 text-[#B89146]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              ปลอดภัย • ไม่มีค่าธรรมเนียมแฝง
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}