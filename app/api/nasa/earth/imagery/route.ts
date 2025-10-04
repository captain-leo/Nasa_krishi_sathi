import { type NextRequest, NextResponse } from "next/server"
import { nasaFetch } from "@/lib/nasa"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const date = searchParams.get("date") ?? undefined // YYYY-MM-DD
    const dim = searchParams.get("dim") ?? "0.1" // image width and height in degrees
    if (!lat || !lon) {
      return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
    }
    const data = await nasaFetch("planetary/earth/imagery", {
      lat,
      lon,
      date,
      dim,
      cloud_score: true,
    })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
