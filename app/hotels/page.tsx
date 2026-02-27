"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";

type ApiHotel = {
  _id: string;
  hotelName: string;
  location: string;
  price: number;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  stars?: number;
  distanceKm?: number;
};

type Hotel = {
  id: string;
  name: string;
  area: string;
  price: number;
  distanceKm: number;
  rating: number;
  reviews: number;
  stars: number;
  image: string;
};

export default function HotelSearchPage() {
  const searchParams = useSearchParams();
  const [apiData, setApiData] = useState<ApiHotel[]>([]);
  const [loading, setLoading] = useState(false);

  const searchedLocation =
    searchParams.get("location") ||
    searchParams.get("city") ||
    "All Destinations";

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);

        const location =
          searchParams.get("location") || searchParams.get("city") || "";

        const minPrice = searchParams.get("minPrice") || "";
        const maxPrice = searchParams.get("maxPrice") || "";
        const sortBy = searchParams.get("sortBy") || "";

        const query = new URLSearchParams({
          location,
          minPrice,
          maxPrice,
          sortBy,
        }).toString();

        const res = await fetch(`http://localhost:3001/hotels/search?${query}`);

        const result = await res.json();

        // 🔥 สำคัญมาก: backend ส่ง { data: [...] }
        setApiData(result.data || []);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

 const mappedHotels: Hotel[] = useMemo(() => {
  return apiData.map((api) => {
    console.log("imageUrl:", api.imageUrl);

    return {
      id: api._id,
      name: api.hotelName,
      area: api.location,
      price: api.price,
      distanceKm: api.distanceKm || 0,
      rating: api.rating || 0,
      reviews: api.reviews || 0,
      stars: api.stars || 0,

      // ✅ ใช้ตรง ๆ ถ้าเป็น full URL
      image:
        api.imageUrl && api.imageUrl.startsWith("http")
          ? api.imageUrl
          : "https://via.placeholder.com/800x450?text=No+Image",
    };
  });
}, [apiData]);

  const formatBaht = (n: number) => new Intl.NumberFormat("th-TH").format(n);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      <Header />

      <div className="pt-32 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-4 capitalize">
          {searchedLocation}
        </h1>
        <p className="text-sm text-slate-500">
          {loading ? "Searching..." : `Found ${mappedHotels.length} properties`}
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-6">
        {loading && <p className="text-center">Loading...</p>}

        {!loading && mappedHotels.length === 0 && (
          <p className="text-center">No hotels found.</p>
        )}

        {!loading && mappedHotels.length > 0 && (
          <div className="space-y-8">
            {mappedHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="flex flex-col md:flex-row bg-white border rounded overflow-hidden shadow-sm"
              >
                {/* Image */}
                <div className="w-full md:w-2/5 aspect-[16/9] relative">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/800x450?text=No+Image";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="w-full md:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">
                        {"★".repeat(hotel.stars)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {hotel.reviews} reviews
                      </span>
                    </div>

                    <h2 className="text-2xl font-semibold mb-2">
                      {hotel.name}
                    </h2>

                    <p className="text-sm text-gray-500 mb-4">
                      📍 {hotel.area} • {hotel.distanceKm} km from center
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-bold">
                        ฿{formatBaht(hotel.price)}
                      </p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>

                    <Link
                      href={`/hotels/${hotel.id}`}
                      className="bg-black text-white px-6 py-3 text-sm uppercase tracking-wider"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
