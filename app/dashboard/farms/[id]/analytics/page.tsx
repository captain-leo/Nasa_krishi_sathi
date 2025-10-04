import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Satellite, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"
import { NDVIChart } from "@/components/analytics/ndvi-chart"
import { SatelliteImageViewer } from "@/components/analytics/satellite-image-viewer"

export default async function FarmAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Fetch all farm crops
  const { data: farmCrops } = await supabase
    .from("farm_crops")
    .select(
      `
      *,
      crop_types (name)
    `,
    )
    .eq("farm_id", id)
    .eq("status", "active")

  // Fetch monitoring data for all crops
  const cropIds = farmCrops?.map((c) => c.id) || []
  const { data: monitoringData } = await supabase
    .from("crop_monitoring")
    .select("*")
    .in("farm_crop_id", cropIds)
    .order("monitoring_date", { ascending: true })

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
            <Satellite className="h-8 w-8 text-green-600" />
            Crop Analytics - {farm.name}
          </h1>
          <p className="text-muted-foreground mt-2">NASA satellite data and crop health monitoring</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Crops</p>
                  <p className="text-2xl font-bold text-green-700">{farmCrops?.length || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg NDVI</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {monitoringData && monitoringData.length > 0
                      ? (
                          monitoringData.reduce((sum, d) => sum + (d.ndvi_value || 0), 0) / monitoringData.length
                        ).toFixed(3)
                      : "N/A"}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Health</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {monitoringData && monitoringData.length > 0
                      ? Math.round(
                          monitoringData.reduce((sum, d) => sum + (d.health_score || 0), 0) / monitoringData.length,
                        )
                      : "N/A"}
                    /100
                  </p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Points</p>
                  <p className="text-2xl font-bold text-amber-700">{monitoringData?.length || 0}</p>
                </div>
                <Satellite className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NDVI Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>NDVI Trend Analysis</CardTitle>
            <CardDescription>Normalized Difference Vegetation Index over time</CardDescription>
          </CardHeader>
          <CardContent>
            <NDVIChart data={monitoringData || []} crops={farmCrops || []} />
          </CardContent>
        </Card>

        {/* Satellite Imagery */}
        {farm.location_lat && farm.location_lng && (
          <Card>
            <CardHeader>
              <CardTitle>Satellite Imagery</CardTitle>
              <CardDescription>Latest satellite view of your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <SatelliteImageViewer lat={Number(farm.location_lat)} lon={Number(farm.location_lng)} />
            </CardContent>
          </Card>
        )}

        {/* Crop-wise Monitoring */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Crop-wise Health Status</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmCrops?.map((crop) => {
              const cropMonitoring = monitoringData?.filter((m) => m.farm_crop_id === crop.id) || []
              const latestData = cropMonitoring[cropMonitoring.length - 1]

              return (
                <Card key={crop.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{crop.crop_types?.name}</CardTitle>
                    <CardDescription>{crop.area_hectares} hectares</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {latestData ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">NDVI:</span>
                          <span className="font-bold text-green-700">{latestData.ndvi_value?.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Soil Moisture:</span>
                          <span className="font-medium">{latestData.soil_moisture}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Health Score:</span>
                          <span className="font-bold text-purple-700">{latestData.health_score}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Updated:</span>
                          <span className="text-xs">{new Date(latestData.monitoring_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No monitoring data available</p>
                    )}
                    <Button asChild className="w-full mt-4" size="sm">
                      <Link href={`/dashboard/crops/${crop.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
