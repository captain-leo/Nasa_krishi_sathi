// GET: /api/nasa/weather?lat=..&lon=..&days=7
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = Number(searchParams.get("lat"))
    const lon = Number(searchParams.get("lon"))
    const days = Number(searchParams.get("days") || 7)

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
    }

    const today = new Date()
    const end = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(
      today.getDate(),
    ).padStart(2, "0")}`
    const startDate = new Date(today.getTime() - (Math.max(1, days) - 1) * 86400000)
    const start = `${startDate.getFullYear()}${String(startDate.getMonth() + 1).padStart(
      2,
      "0",
    )}${String(startDate.getDate()).padStart(2, "0")}`

    const qs = new URLSearchParams({
      parameters: "T2M,RH2M,PRECTOT,WS10M",
      community: "AG",
      longitude: String(lon),
      latitude: String(lat),
      start,
      end,
      format: "JSON",
    })
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?${qs.toString()}`
    const r = await fetch(url, { cache: "no-store" })
    if (!r.ok) throw new Error(`POWER API error: ${r.status}`)
    const data = await r.json()

    const records = data?.properties?.parameter || {}
    const daysKeys = Object.keys(records?.T2M || {}).sort()
    const forecast = daysKeys.map((d) => ({
      date: d,
      tempC: records?.T2M?.[d] ?? null,
      humidity: records?.RH2M?.[d] ?? null,
      rainfall: records?.PRECTOT?.[d] ?? null,
      wind10m: records?.WS10M?.[d] ?? null,
    }))

    return NextResponse.json({ ok: true, lat, lon, forecast })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 })
  }
}
