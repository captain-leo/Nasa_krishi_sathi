import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewFarmForm } from "@/components/farms/new-farm-form"

export default async function NewFarmPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <NewFarmForm userId={user.id} />
      </div>
    </div>
  )
}
