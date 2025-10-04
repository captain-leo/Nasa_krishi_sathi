import { type NextRequest, NextResponse } from "next/server"
import { nasaFetch } from "@/lib/nasa"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date") ?? undefined // YYYY-MM-DD
    const count = searchParams.get("count") ?? undefined // random N results
    const data = await nasaFetch("planetary/apod", {
      date,
      count,
      hd: true,
      thumbs: true,
    })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
