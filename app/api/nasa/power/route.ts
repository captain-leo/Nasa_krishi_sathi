import { nasaPowerDailyPoint } from "@/lib/nasa"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = Number(searchParams.get("lat"))
    const lon = Number(searchParams.get("lon"))
    const start = searchParams.get("start") || ""
    const end = searchParams.get("end") || ""
    const parameters = searchParams.get("parameters") || undefined
    if (!lat || !lon || !start || !end) {
      return Response.json({ error: "lat, lon, start, end required" }, { status: 400 })
    }
    const data = await nasaPowerDailyPoint({ lat, lon, start, end, parameters })
    return Response.json(data, { status: 200 })
  } catch (e: any) {
    return Response.json({ error: e.message || "POWER error" }, { status: 500 })
  }
}
