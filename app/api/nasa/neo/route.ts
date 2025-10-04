import { type NextRequest, NextResponse } from "next/server"
import { nasaFetch } from "@/lib/nasa"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const start_date = searchParams.get("start_date") ?? undefined // YYYY-MM-DD
    const end_date = searchParams.get("end_date") ?? undefined
    const data = await nasaFetch("neo/rest/v1/feed", {
      start_date,
      end_date,
    })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
