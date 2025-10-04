import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Download } from "lucide-react"
import Link from "next/link"
import { MRVDashboard } from "@/components/mrv/mrv-dashboard"

export default async function FarmMRVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch farm details
  const { data: farm, error: farmError } = await supabase
    .from("farms")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (farmError || !farm) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link href={`/dashboard/farms/${farm.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Farm
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-green-600" />
              MRV Reporting
            </h1>
            <p className="text-muted-foreground mt-2">Measurement, Reporting & Verification for {farm.name}</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* MRV Dashboard */}
        <MRVDashboard farmId={farm.id} />
      </div>
    </div>
  )
}
