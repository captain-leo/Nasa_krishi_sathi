import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } },
    )
    const { data, error } = await supabase
      .from("datasets")
      .insert({
        name: body.name || "dataset",
        kind: body.type || "unknown",
        payload: body.rows || body.data || null,
      })
      .select("*")
      .single()
    if (error) throw error
    return Response.json(data, { status: 201 })
  } catch (e: any) {
    return Response.json({ error: e.message || "Upload error" }, { status: 500 })
  }
}
