import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { estimateCredits, type CropType, FARMER_PRICE_RANGE, INDUSTRY_PRICE_RANGE } from "@/lib/carbon"

function getSupabase() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Next.js: noop; server mutates headers internally when needed
        },
        remove(name: string, options: any) {
          // noop
        },
      },
    },
  )
  return supabase
}

export async function GET() {
  const supabase = getSupabase()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { data, error } = await supabase
    .from("carbon_transactions")
    .select("*")
    .eq("owner", user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ transactions: data ?? [] })
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const body = await request.json()
  const crop = (body?.crop || "mixed") as CropType
  const hectares = Number(body?.hectares || 0)
  const side = body?.side === "industry" ? "industry" : "farmer" // who is transacting
  const unit_price = Number(body?.unit_price)

  if (!hectares || hectares <= 0) {
    return NextResponse.json({ error: "hectares must be > 0" }, { status: 400 })
  }

  // Validate price in allowed ranges
  const allowed =
    side === "industry"
      ? unit_price >= INDUSTRY_PRICE_RANGE.min && unit_price <= INDUSTRY_PRICE_RANGE.max
      : unit_price >= FARMER_PRICE_RANGE.min && unit_price <= FARMER_PRICE_RANGE.max

  if (!allowed) {
    return NextResponse.json(
      {
        error:
          side === "industry"
            ? `unit_price must be ${INDUSTRY_PRICE_RANGE.min}-${INDUSTRY_PRICE_RANGE.max} USD for industry`
            : `unit_price must be ${FARMER_PRICE_RANGE.min}-${FARMER_PRICE_RANGE.max} USD for farmer`,
      },
      { status: 400 },
    )
  }

  const { credits, rate } = estimateCredits(hectares, crop)
  const total_value = credits * unit_price

  const { data, error } = await supabase
    .from("carbon_transactions")
    .insert({
      owner: user.id,
      side,
      crop_type: crop,
      area_ha: hectares,
      credits,
      unit_price,
      total_value,
      method_rate_tco2e_per_ha: rate,
    })
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ transaction: data })
}
