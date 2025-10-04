import { NextResponse } from "next/server"
import { LIVESTOCK_DATA } from "@/data/livestock-requirements"

export async function GET() {
  return NextResponse.json(LIVESTOCK_DATA)
}
