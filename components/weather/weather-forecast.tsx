"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, Loader2 } from "lucide-react"

interface WeatherForecastProps {
  farmId: string
}

export function WeatherForecast({ farmId }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadForecast()
  }, [farmId])

  const loadForecast = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/weather/forecast?farmId=${farmId}&days=7`)
      const data = await response.json()
      setForecast(data.forecast || [])
    } catch (error) {
      console.error("[v0] Error loading weather forecast:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-600" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-600" />
      case "sunny":
      default:
        return <Sun className="h-8 w-8 text-yellow-600" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Weather Forecast</CardTitle>
        <CardDescription>Powered by NASA POWER meteorological data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-4">
                {getWeatherIcon(day.condition)}
                <div>
                  <p className="font-semibold">
                    {new Date(day.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">{day.condition}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-red-600" />
                    <span className="font-bold text-lg">{day.temperature}°C</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {day.temperatureMin}° / {day.temperatureMax}°
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{day.humidity}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                </div>

                {day.precipitation > 0 && (
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <CloudRain className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{day.precipitation}mm</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rain</p>
                  </div>
                )}

                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">{day.windSpeed} km/h</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Wind</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
