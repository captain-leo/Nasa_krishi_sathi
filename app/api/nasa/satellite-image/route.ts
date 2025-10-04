import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const date = searchParams.get("date")
    const type = searchParams.get("type") || "RGB"

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 })
    }

    // In production, this would fetch from NASA Worldview or Sentinel Hub
    // For now, we'll generate a placeholder URL
    const placeholderUrl = `/placeholder.svg?height=400&width=600&query=satellite+imagery+${type}+${lat}+${lon}`

    return NextResponse.json({
      imageUrl: placeholderUrl,
      date: date || new Date().toISOString().split("T")[0],
      type,
      coordinates: [Number.parseFloat(lat), Number.parseFloat(lon)],
      source: "NASA Worldview / Sentinel-2 (Simulated)",
    })
  } catch (error) {
    console.error("[v0] Satellite image API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
