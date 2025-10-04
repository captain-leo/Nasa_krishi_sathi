import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Sprout, Calendar, Droplets, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"

export default async function CropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch crop details with farm and crop type info
  const { data: farmCrop, error: cropError } = await supabase
    .from("farm_crops")
    .select(
      `
      *,
      farms!inner (
        id,
        name,
        user_id,
        state,
        district
      ),
      crop_types (*)
    `,
    )
    .eq("id", id)
    .single()

  if (cropError || !farmCrop || farmCrop.farms.user_id !== user.id) {
    redirect("/dashboard")
  }

  // Fetch monitoring data
  const { data: monitoringData } = await supabase
    .from("crop_monitoring")
    .select("*")
    .eq("farm_crop_id", id)
    .order("monitoring_date", { ascending: false })
    .limit(10)

  // Fetch irrigation events
  const { data: irrigationEvents } = await supabase
    .from("irrigation_events")
    .select("*")
    .eq("farm_crop_id", id)
    .order("event_date", { ascending: false })
    .limit(5)

  // Fetch fertilizer applications
  const { data: fertilizerApps } = await supabase
    .from("fertilizer_applications")
    .select("*")
    .eq("farm_crop_id", id)
    .order("application_date", { ascending: false })
    .limit(5)

  // Calculate days since planting
  const daysSincePlanting = Math.floor(
    (new Date().getTime() - new Date(farmCrop.planting_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  // Calculate total growing days
  const totalGrowingDays = farmCrop.crop_types?.growth_stages?.reduce(
    (sum: number, stage: any) => sum + stage.durationDays,
    0,
  )

  // Calculate progress percentage
  const progressPercentage = Math.min((daysSincePlanting / totalGrowingDays) * 100, 100)

  // Find current growth stage
  let currentStageIndex = 0
  let daysPassed = 0
  for (let i = 0; i < farmCrop.crop_types?.growth_stages?.length; i++) {
    daysPassed += farmCrop.crop_types.growth_stages[i].durationDays
    if (daysSincePlanting < daysPassed) {
      currentStageIndex = i
      break
    }
  }

  const latestMonitoring = monitoringData?.[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link href={`/dashboard/farms/${farmCrop.farms.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Farm
            </Link>
          </Button>
        </div>

        {/* Crop Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Sprout className="h-8 w-8 text-green-600" />
                  {farmCrop.crop_types?.name}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {farmCrop.farms.name} • {farmCrop.farms.district}, {farmCrop.farms.state}
                </CardDescription>
              </div>
              <Badge variant={farmCrop.status === "active" ? "default" : "secondary"} className="text-sm">
                {farmCrop.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Area</p>
                <p className="text-2xl font-bold text-green-700">{farmCrop.area_hectares} ha</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Planted</p>
                <p className="text-lg font-semibold">{new Date(farmCrop.planting_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expected Harvest</p>
                <p className="text-lg font-semibold">
                  {farmCrop.expected_harvest_date
                    ? new Date(farmCrop.expected_harvest_date).toLocaleDateString()
                    : "TBD"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Days Growing</p>
                <p className="text-2xl font-bold text-blue-700">{daysSincePlanting}</p>
              </div>
            </div>

            {/* Growth Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Growth Progress</p>
                <p className="text-sm text-muted-foreground">{progressPercentage.toFixed(0)}%</p>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Current Stage: <span className="font-medium">{farmCrop.current_stage}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Latest Monitoring Data */}
            {latestMonitoring && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Latest Health Metrics
                  </CardTitle>
                  <CardDescription>
                    Last updated: {new Date(latestMonitoring.monitoring_date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">NDVI</p>
                      <p className="text-2xl font-bold text-green-700">{latestMonitoring.ndvi_value?.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Soil Moisture</p>
                      <p className="text-2xl font-bold text-blue-700">{latestMonitoring.soil_moisture}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Temperature</p>
                      <p className="text-2xl font-bold text-orange-700">{latestMonitoring.temperature_celsius}°C</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Health Score</p>
                      <p className="text-2xl font-bold text-purple-700">{latestMonitoring.health_score}/100</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Growth Stages Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Growth Stages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {farmCrop.crop_types?.growth_stages?.map((stage: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        index === currentStageIndex
                          ? "bg-green-50 border-green-300"
                          : index < currentStageIndex
                            ? "bg-muted border-muted"
                            : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{stage.stage}</h4>
                        <Badge variant={index === currentStageIndex ? "default" : "outline"}>
                          {stage.durationDays} days
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    Recent Irrigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {irrigationEvents && irrigationEvents.length > 0 ? (
                    <div className="space-y-2">
                      {irrigationEvents.map((event) => (
                        <div key={event.id} className="flex justify-between text-sm p-2 bg-muted rounded">
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                          <span className="font-medium">{event.water_amount_liters}L</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No irrigation events recorded</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                    Recent Fertilizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {fertilizerApps && fertilizerApps.length > 0 ? (
                    <div className="space-y-2">
                      {fertilizerApps.map((app) => (
                        <div key={app.id} className="text-sm p-2 bg-muted rounded">
                          <div className="flex justify-between mb-1">
                            <span>{new Date(app.application_date).toLocaleDateString()}</span>
                            <span className="font-medium">{app.amount_kg} kg</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{app.fertilizer_type}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No fertilizer applications recorded</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Crop Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Crop Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Environment</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="font-medium">
                        {farmCrop.crop_types?.environmental_requirements?.temperatureRangeCelsius}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rainfall:</span>
                      <span className="font-medium">
                        {farmCrop.crop_types?.environmental_requirements?.rainfallMM} mm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">pH:</span>
                      <span className="font-medium">{farmCrop.crop_types?.environmental_requirements?.phRange}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Resources</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Water:</span>
                      <Badge variant="outline">{farmCrop.crop_types?.resource_consumption?.waterDemand}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fertilizer:</span>
                      <Badge variant="outline">{farmCrop.crop_types?.resource_consumption?.fertilizerDemand}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Expected Yield</h4>
                  <p className="text-sm">
                    <span className="font-bold text-green-700">
                      {(
                        (farmCrop.crop_types?.yield_metrics?.averageYieldKgPerHectare ||
                          farmCrop.crop_types?.yield_metrics?.averageYieldKgGreenBeanPerHectare) *
                        farmCrop.area_hectares
                      ).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground"> kg total</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href={`/dashboard/crops/${id}/monitor`}>Add Monitoring Data</Link>
                </Button>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href={`/dashboard/crops/${id}/irrigate`}>Log Irrigation</Link>
                </Button>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href={`/dashboard/crops/${id}/fertilize`}>Log Fertilizer</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
