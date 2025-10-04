// GET: /api/nasa/data?lat=..&lon=..&start=YYYYMMDD&end=YYYYMMDD
// POST: { lat, lon, start?, end? }
import { NextResponse } from "next/server"

type Params = {
  lat: number
  lon: number
  start?: string // YYYYMMDD
  end?: string // YYYYMMDD
}

async function fetchPowerDailyPoint({ lat, lon, start, end }: Params) {
  const today = new Date()
  const ymd = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`
  const defaultEnd = ymd(today)
  const defaultStart = ymd(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)) // last 7 days

  const qs = new URLSearchParams({
    parameters: "T2M,RH2M,PRECTOT,WS10M",
    community: "AG",
    longitude: String(lon),
    latitude: String(lat),
    start: start || defaultStart,
    end: end || defaultEnd,
    format: "JSON",
  })

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?${qs.toString()}`
  const r = await fetch(url, { cache: "no-store" })
  if (!r.ok) throw new Error(`POWER API error: ${r.status}`)
  const data = await r.json()

  // Normalize series into array of days with metrics
  const records = data?.properties?.parameter || {}
  const days = Object.keys(records?.T2M || {}).sort()
  const series = days.map((d) => ({
    date: d,
    t2m: records?.T2M?.[d] ?? null,
    rh2m: records?.RH2M?.[d] ?? null,
    prectot: records?.PRECTOT?.[d] ?? null,
    ws10m: records?.WS10M?.[d] ?? null,
  }))

  // Latest snapshot
  const latest = series.length ? series[series.length - 1] : null

  // Simple derived indicators
  const avgT2M = series.length ? series.reduce((acc, s) => acc + (Number(s.t2m) || 0), 0) / series.length : null
  const totalRain = series.length ? series.reduce((acc, s) => acc + (Number(s.prectot) || 0), 0) : null

  return {
    source: "NASA POWER",
    lat,
    lon,
    start: start || defaultStart,
    end: end || defaultEnd,
    latest,
    series,
    indicators: {
      avgT2M,
      totalRain,
    },
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = Number(searchParams.get("lat"))
    const lon = Number(searchParams.get("lon"))
    const start = searchParams.get("start") || undefined
    const end = searchParams.get("end") || undefined

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
    }

    const data = await fetchPowerDailyPoint({ lat, lon, start, end })
    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Params>
    const lat = Number(body.lat)
    const lon = Number(body.lon)
    const start = body.start
    const end = body.end

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
    }

    const data = await fetchPowerDailyPoint({ lat, lon, start, end })
    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 })
  }
}
