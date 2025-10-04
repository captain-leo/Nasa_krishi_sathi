import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Sprout, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function FarmDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Fetch farm crops
  const { data: farmCrops } = await supabase
    .from("farm_crops")
    .select(
      `
      *,
      crop_types (*)
    `,
    )
    .eq("farm_id", id)
    .order("created_at", { ascending: false })

  const activeCrops = farmCrops?.filter((c) => c.status === "active") || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Farm Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <MapPin className="h-8 w-8 text-green-600" />
                  {farm.name}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {farm.district}, {farm.state}
                </CardDescription>
              </div>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href={`/dashboard/farms/${farm.id}/crops/new`}>
                  <Sprout className="h-4 w-4 mr-2" />
                  Add Crop
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Area</p>
                <p className="text-2xl font-bold text-green-700">{farm.area_hectares} ha</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Soil Type</p>
                <p className="text-lg font-semibold">{farm.soil_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Crops</p>
                <p className="text-2xl font-bold text-blue-700">{activeCrops.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-sm font-medium">
                  {farm.location_lat && farm.location_lng
                    ? `${Number(farm.location_lat).toFixed(4)}, ${Number(farm.location_lng).toFixed(4)}`
                    : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Crops */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Active Crops</h2>
          {activeCrops.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCrops.map((crop) => (
                <Card key={crop.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sprout className="h-5 w-5 text-green-600" />
                      {crop.crop_types?.name}
                    </CardTitle>
                    <CardDescription>Current Stage: {crop.current_stage || "Not set"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Area:</span>
                        <span className="font-medium">{crop.area_hectares} ha</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Planted:</span>
                        <span className="font-medium">{new Date(crop.planting_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected Harvest:</span>
                        <span className="font-medium">
                          {crop.expected_harvest_date
                            ? new Date(crop.expected_harvest_date).toLocaleDateString()
                            : "TBD"}
                        </span>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4" size="sm">
                      <Link href={`/dashboard/crops/${crop.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active crops</h3>
                <p className="text-muted-foreground mb-6">Start monitoring by adding your first crop</p>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href={`/dashboard/farms/${farm.id}/crops/new`}>
                    <Sprout className="h-4 w-4 mr-2" />
                    Add Crop
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={`/dashboard/farms/${farm.id}/weather`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Weather Forecast</h3>
                    <p className="text-sm text-muted-foreground">7-day forecast & alerts</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={`/dashboard/farms/${farm.id}/analytics`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Crop Analytics</h3>
                    <p className="text-sm text-muted-foreground">NDVI & health metrics</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={`/dashboard/farms/${farm.id}/mrv`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">MRV Reports</h3>
                    <p className="text-sm text-muted-foreground">Sustainability tracking</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
