import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AddCropForm } from "@/components/crops/add-crop-form"

export default async function AddCropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Verify farm ownership
  const { data: farm, error: farmError } = await supabase
    .from("farms")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (farmError || !farm) {
    redirect("/dashboard")
  }

  // Fetch available crop types
  const { data: cropTypes } = await supabase.from("crop_types").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AddCropForm farm={farm} cropTypes={cropTypes || []} />
      </div>
    </div>
  )
}
