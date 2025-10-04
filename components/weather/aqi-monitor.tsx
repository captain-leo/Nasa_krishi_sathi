"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Loader2 } from "lucide-react"

interface AQIMonitorProps {
  farmId: string
}

export function AQIMonitor({ farmId }: AQIMonitorProps) {
  const [aqiData, setAqiData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAQI()
  }, [farmId])

  const loadAQI = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/weather/aqi?farmId=${farmId}`)
      const data = await response.json()
      setAqiData(data.aqi)
    } catch (error) {
      console.error("[v0] Error loading AQI data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAQIColor = (category: string) => {
    switch (category) {
      case "Good":
        return "bg-green-500"
      case "Moderate":
        return "bg-yellow-500"
      case "Unhealthy for Sensitive Groups":
        return "bg-orange-500"
      case "Unhealthy":
        return "bg-red-500"
      case "Very Unhealthy":
        return "bg-purple-500"
      case "Hazardous":
        return "bg-red-900"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!aqiData) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">No AQI data available</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Air Quality Index
        </CardTitle>
        <CardDescription>Current air quality conditions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AQI Score */}
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getAQIColor(aqiData.category)}`}
          >
            <div className="text-white">
              <p className="text-4xl font-bold">{aqiData.aqi}</p>
              <p className="text-sm">AQI</p>
            </div>
          </div>
          <Badge className="mt-4" variant="outline">
            {aqiData.category}
          </Badge>
        </div>

        {/* Pollutant Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Pollutant Levels</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">PM2.5</p>
              <p className="text-lg font-bold">{aqiData.pm25}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">PM10</p>
              <p className="text-lg font-bold">{aqiData.pm10}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">O₃</p>
              <p className="text-lg font-bold">{aqiData.o3}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">NO₂</p>
              <p className="text-lg font-bold">{aqiData.no2}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">SO₂</p>
              <p className="text-lg font-bold">{aqiData.so2}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">CO</p>
              <p className="text-lg font-bold">{aqiData.co}</p>
            </div>
          </div>
        </div>

        {/* Health Recommendations */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-900 mb-2">Recommendations</h4>
          <p className="text-sm text-blue-700">
            {aqiData.category === "Good" && "Air quality is satisfactory. Ideal conditions for outdoor farm work."}
            {aqiData.category === "Moderate" &&
              "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exposure."}
            {(aqiData.category === "Unhealthy for Sensitive Groups" || aqiData.category === "Unhealthy") &&
              "Consider wearing masks during extended outdoor work. Monitor crop health for air pollution effects."}
            {(aqiData.category === "Very Unhealthy" || aqiData.category === "Hazardous") &&
              "Limit outdoor activities. Air pollution may affect crop growth and worker health."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
