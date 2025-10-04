// GET: /api/nasa/agriculture?lat=..&lon=..
// Uses POWER daily series to compute basic indices and advice.
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = Number(searchParams.get("lat"))
    const lon = Number(searchParams.get("lon"))

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
    }

    // Pull 14 days for smoother signals
    const today = new Date()
    const end = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(
      today.getDate(),
    ).padStart(2, "0")}`
    const startDate = new Date(today.getTime() - 13 * 86400000)
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

    const p = data?.properties?.parameter || {}
    const keys = Object.keys(p?.T2M || {}).sort()
    const series = keys.map((d) => ({
      date: d,
      t2m: p?.T2M?.[d] ?? null,
      rh2m: p?.RH2M?.[d] ?? null,
      prectot: p?.PRECTOT?.[d] ?? null,
      ws10m: p?.WS10M?.[d] ?? null,
    }))

    // Simple indices
    const totalRain14 = series.reduce((acc, s) => acc + (Number(s.prectot) || 0), 0)
    const avgTemp14 = series.reduce((acc, s) => acc + (Number(s.t2m) || 0), 0) / Math.max(1, series.length)
    const avgRH14 = series.reduce((acc, s) => acc + (Number(s.rh2m) || 0), 0) / Math.max(1, series.length)

    // Heuristic: moisture score from rainfall and humidity; scale 0-1
    const moistureScore = Math.max(0, Math.min(1, (totalRain14 / 50) * 0.7 + (avgRH14 / 100) * 0.3))
    const droughtRisk = moistureScore < 0.35 ? "high" : moistureScore < 0.6 ? "medium" : "low"

    let irrigationAdvice = "Maintain normal irrigation schedule."
    if (moistureScore < 0.35) irrigationAdvice = "Increase irrigation: low moisture detected."
    else if (moistureScore < 0.5) irrigationAdvice = "Slightly increase irrigation: below optimal moisture."

    let sowHarvestAdvice = "Conditions stable; follow planned schedule."
    if (avgTemp14 < 15) sowHarvestAdvice = "Cool conditions; delay sowing sensitive crops."
    else if (avgTemp14 > 30) sowHarvestAdvice = "High temperature; consider heat-tolerant varieties."

    return NextResponse.json({
      ok: true,
      lat,
      lon,
      summary: {
        avgTemp14,
        avgRH14,
        totalRain14,
        droughtRisk,
        moistureScore,
        advice: {
          irrigation: irrigationAdvice,
          sowHarvest: sowHarvestAdvice,
        },
      },
      series,
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 })
  }
}
