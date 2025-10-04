import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } },
    )
    const { data, error } = await supabase
      .from("fertilizer_applications")
      .select("*")
      .order("applied_at", { ascending: false })
    if (error) throw error
    return Response.json(data || [], { status: 200 })
  } catch (e: any) {
    return Response.json({ error: e.message || "Fetch error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } },
    )

    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    const owner = userRes.user.id

    const { data, error } = await supabase
      .from("fertilizer_applications")
      .insert({
        farm_id: body.farm_id || null,
        crop: body.crop || null,
        fertilizer_type: body.fertilizer_type || null,
        amount_kg: body.amount_kg ? Number(body.amount_kg) : null,
        applied_at: body.applied_at || new Date().toISOString().slice(0, 10),
        notes: body.notes || null,
        owner, // ensure RLS owner-based policies pass
      })
      .select("*")
      .single()
    if (error) throw error
    return Response.json(data, { status: 201 })
  } catch (e: any) {
    return Response.json({ error: e.message || "Create error" }, { status: 500 })
  }
}
