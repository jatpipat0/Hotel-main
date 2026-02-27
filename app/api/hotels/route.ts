// app/api/hotels/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Hotel } from "@/lib/models/Hotel";
import { Room } from "@/lib/models/Room";

export const dynamic = "force-dynamic";

function toNum(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    // ✅ city ค้นหาแบบ contains (รองรับ "เชียงใหม่, ไทย")
    const cityRaw = (searchParams.get("city") ?? "เชียงใหม่").trim();

    const guests = toNum(searchParams.get("guests"), 2);
    const maxPrice = toNum(searchParams.get("maxPrice"), 3000);
    const breakfastOnly = (searchParams.get("breakfastOnly") ?? "0") === "1";
    const refundableOnly = (searchParams.get("refundableOnly") ?? "0") === "1";

    // 1) โรงแรม: active + ตามเมือง (regex)
    const hotelDocs = await Hotel.find({
      active: true,
      city: { $regex: cityRaw, $options: "i" },
    }).lean();

    const hotelIds = (hotelDocs as any[]).map((h) => h._id);

    // 2) ห้อง: อิง hotelId + active เท่านั้น
    const roomDocs = await Room.find({
      hotelId: { $in: hotelIds },
      active: true,
    }).lean();

    // 3) group ห้องตาม hotelId
    const roomsByHotelId = new Map<string, any[]>();
    for (const r of roomDocs as any[]) {
      const key = String((r as any).hotelId);
      const arr = roomsByHotelId.get(key) ?? [];
      arr.push(r);
      roomsByHotelId.set(key, arr);
    }

    // 4) ทำ output ให้ตรง type Hotel ของหน้าเว็บ (มี rooms[])
    const hotels = (hotelDocs as any[])
      .map((h) => {
        const roomsRaw = roomsByHotelId.get(String(h._id)) ?? [];

        const roomsFiltered = roomsRaw.filter((r) => {
          // capacity
          if (Number(r.capacity ?? 0) < guests) return false;

          // max price
          if (Number(r.pricePerNight ?? 0) > maxPrice) return false;

          // breakfast / refundable
          if (breakfastOnly && !r.breakfast) return false;
          if (refundableOnly && !r.refundable) return false;

          // stock
          if (typeof r.stock === "number" && r.stock <= 0) return false;

          return true;
        });

        return {
          id: String(h._id),
          name: String(h.name),
          city: String(h.city),
          stars: h.stars as 3 | 4 | 5,
          rating: Number(h.rating ?? 0),
          reviews: Number(h.reviews ?? 0),
          distanceKm: Number(h.distanceKm ?? 0),
          amenities: Array.isArray(h.amenities) ? h.amenities : [],
          coverImage: String(h.coverImage ?? ""),
          rooms: roomsFiltered.map((r) => ({
            id: String(r._id),
            name: String(r.name),
            capacity: Number(r.capacity),
            bed: String(r.bed ?? "Queen"),
            refundable: Boolean(r.refundable),
            breakfast: Boolean(r.breakfast),
            pricePerNight: Number(r.pricePerNight),
            stock: typeof r.stock === "number" ? Number(r.stock) : undefined,
          })),
        };
      })
      // ตัดโรงแรมที่ไม่มีห้องผ่านเงื่อนไขออก
      .filter((h) => h.rooms.length > 0);

    // เรียงราคาถูกสุดก่อน
    hotels.sort((a, b) => {
      const minA = Math.min(...a.rooms.map((r) => r.pricePerNight));
      const minB = Math.min(...b.rooms.map((r) => r.pricePerNight));
      return minA - minB;
    });

    return NextResponse.json({ hotels }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}