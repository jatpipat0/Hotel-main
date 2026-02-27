import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Hotel } from "@/lib/models/Hotel";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { message: "City is required" },
      { status: 400 }
    );
  }

  try {
    const hotels = await Hotel.find({
      city: city,
      active: true,
    });

    return NextResponse.json(hotels);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}