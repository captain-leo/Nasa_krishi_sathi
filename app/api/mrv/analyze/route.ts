import { nasaPowerDailyPoint } from "@/lib/nasa"
import type { GeoJSON } from "geojson"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const geometry = body?.geometry as GeoJSON.Polygon | undefined
    if (!geometry) return Response.json({ error: "geometry required" }, { status: 400 })

    // Compute area on client already; here we do a simple enrichment using POWER for the centroid.
    const coords = geometry.coordinates?.[0]
    if (!Array.isArray(coords) || coords.length < 3) {
      return Response.json({ error: "invalid polygon" }, { status: 400 })
    }
    // Compute centroid
    let lngSum = 0,
      latSum = 0
    coords.forEach(([lng, lat]: [number, number]) => {
      lngSum += lng
      latSum += lat
    })
    const lng = lngSum / coords.length
    const lat = latSum / coords.length

    // Past 7 days window
    const end = new Date()
    const start = new Date(Date.now() - 6 * 24 * 3600 * 1000)
    const fmt = (d: Date) =>
      `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`

    const power = await nasaPowerDailyPoint({
      lat,
      lon: lng,
      start: fmt(start),
      end: fmt(end),
      parameters: "PRECTOTCORR,T2M",
    })

    // Summarize rainfall (mm)
    const daily = power?.properties?.parameter || {}
    const rainSeries = daily?.PRECTOTCORR || {}
    const temps = daily?.T2M || {}
    const rainValues = Object.values(rainSeries).map((v: any) => Number(v) || 0)
    const tempValues = Object.values(temps).map((v: any) => Number(v) || 0)
    const rainSum = rainValues.reduce((a: number, b: number) => a + b, 0)
    const tempAvg = tempValues.length ? tempValues.reduce((a: number, b: number) => a + b, 0) / tempValues.length : 0

    // Heuristic recommendation
    let message = "Balanced irrigation recommended."
    if (rainSum > 50) message = "High rainfall recently; reduce irrigation."
    if (rainSum < 10 && tempAvg > 28) message = "Hot and dry period; increase irrigation."
    // Area is computed on client; if needed, client sends area. We report message only here.
    return Response.json({ areaHa: null, message }, { status: 200 })
  } catch (e: any) {
    return Response.json({ error: e.message || "Analyze error" }, { status: 500 })
  }
}
