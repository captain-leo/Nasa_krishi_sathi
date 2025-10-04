import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { WeatherForecast } from "@/components/weather/weather-forecast"
import { AQIMonitor } from "@/components/weather/aqi-monitor"
import { WeatherAlerts } from "@/components/weather/weather-alerts"

export default async function FarmWeatherPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (!farm.location_lat || !farm.location_lng) {
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

          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Location Not Set</h3>
              <p className="text-muted-foreground mb-6">
                Please add GPS coordinates to your farm to access weather data
              </p>
              <Button asChild>
                <Link href={`/dashboard/farms/${farm.id}/edit`}>Add Location</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-900">Weather & Air Quality</h1>
          <p className="text-muted-foreground mt-2">
            {farm.name} • {farm.district}, {farm.state}
          </p>
        </div>

        {/* Weather Alerts */}
        <WeatherAlerts farmId={farm.id} />

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Weather Forecast */}
          <div className="lg:col-span-2">
            <WeatherForecast farmId={farm.id} />
          </div>

          {/* AQI Monitor */}
          <div className="lg:col-span-1">
            <AQIMonitor farmId={farm.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
