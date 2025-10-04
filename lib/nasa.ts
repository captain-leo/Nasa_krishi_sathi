const NASA_API_BASE = "https://api.nasa.gov"

function getNasaKey() {
  const key = process.env.NASA_API_KEY
  if (!key) {
    // Keep the message clear so users add it in Project Settings
    throw new Error("Missing NASA_API_KEY. Please add NASA_API_KEY in Project Settings → Environment Variables.")
  }
  return key
}

export async function nasaFetch(path: string, params: Record<string, string | number | boolean | undefined> = {}) {
  const api_key = getNasaKey()
  const url = new URL(`${NASA_API_BASE}/${path}`)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  })
  url.searchParams.set("api_key", api_key)

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`NASA API error: ${res.status} ${text}`)
  }
  return res.json()
}

export async function nasaPowerDailyPoint({
  lat,
  lon,
  start,
  end,
  parameters = "PRECTOTCORR,T2M",
}: {
  lat: number
  lon: number
  start: string // YYYYMMDD
  end: string // YYYYMMDD
  parameters?: string
}) {
  // POWER API does not require an API key; it is a different domain than api.nasa.gov
  const url = new URL("https://power.larc.nasa.gov/api/temporal/daily/point")
  url.searchParams.set("parameters", parameters)
  url.searchParams.set("community", "AG")
  url.searchParams.set("latitude", String(lat))
  url.searchParams.set("longitude", String(lon))
  url.searchParams.set("start", start)
  url.searchParams.set("end", end)
  url.searchParams.set("format", "JSON")

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POWER API error: ${res.status} ${text}`)
  }
  return res.json()
}
