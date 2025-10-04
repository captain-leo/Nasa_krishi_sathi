import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Sprout, TrendingUp, Droplets } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch user's farms
  const { data: farms, error: farmsError } = await supabase
    .from("farms")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch farm crops count for each farm
  const farmIds = farms?.map((f) => f.id) || []
  const { data: farmCrops } = await supabase.from("farm_crops").select("farm_id, status").in("farm_id", farmIds)

  // Count active crops per farm
  const activeCropsPerFarm = farmCrops?.reduce(
    (acc, crop) => {
      if (crop.status === "active") {
        acc[crop.farm_id] = (acc[crop.farm_id] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Welcome back, {profile?.full_name || "Farmer"}!</h1>
            <p className="text-muted-foreground mt-1">Manage your farms and monitor crop health</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard/profile">Profile</Link>
            </Button>
            <form
              action={async () => {
                "use server"
                const supabase = await createClient()
                await supabase.auth.signOut()
                redirect("/auth/login")
              }}
            >
              <Button type="submit" variant="outline">
                Logout
              </Button>
            </form>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Farms</p>
                  <p className="text-2xl font-bold text-green-700">{farms?.length || 0}</p>
                </div>
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Crops</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {Object.values(activeCropsPerFarm || {}).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
                <Sprout className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Area</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {farms?.reduce((sum, farm) => sum + (Number(farm.area_hectares) || 0), 0).toFixed(1)} ha
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Water Saved</p>
                  <p className="text-2xl font-bold text-teal-700">12.5%</p>
                </div>
                <Droplets className="h-8 w-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farms List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-900">Your Farms</h2>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/dashboard/farms/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Farm
            </Link>
          </Button>
        </div>

        {farms && farms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <Card key={farm.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    {farm.name}
                  </CardTitle>
                  <CardDescription>
                    {farm.district}, {farm.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Area:</span>
                      <span className="font-medium">{farm.area_hectares} hectares</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Soil Type:</span>
                      <span className="font-medium">{farm.soil_type || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Crops:</span>
                      <span className="font-medium">{activeCropsPerFarm?.[farm.id] || 0}</span>
                    </div>
                    <div className="pt-3 flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link href={`/dashboard/farms/${farm.id}`}>View Details</Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 bg-transparent" size="sm">
                        <Link href={`/dashboard/farms/${farm.id}/crops`}>Manage Crops</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No farms yet</h3>
              <p className="text-muted-foreground mb-6">Get started by adding your first farm</p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/dashboard/farms/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Farm
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
