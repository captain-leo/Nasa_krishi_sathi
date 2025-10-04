import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchAQIData } from "@/lib/weather/api"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const farmId = searchParams.get("farmId")

    if (!farmId) {
      return NextResponse.json({ error: "Farm ID required" }, { status: 400 })
    }

    // Fetch farm location
    const { data: farm } = await supabase.from("farms").select("location_lat, location_lng").eq("id", farmId).single()

    if (!farm || !farm.location_lat || !farm.location_lng) {
      return NextResponse.json({ error: "Farm location not set" }, { status: 400 })
    }

    const aqiData = await fetchAQIData(Number(farm.location_lat), Number(farm.location_lng))

    return NextResponse.json({ aqi: aqiData })
  } catch (error) {
    console.error("[v0] AQI API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
