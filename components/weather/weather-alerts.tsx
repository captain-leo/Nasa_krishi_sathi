"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CloudRain, Thermometer, Wind, Snowflake } from "lucide-react"
import { generateWeatherAlerts } from "@/lib/weather/api"

interface WeatherAlertsProps {
  farmId: string
}

export function WeatherAlerts({ farmId }: WeatherAlertsProps) {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [farmId])

  const loadAlerts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/weather/forecast?farmId=${farmId}&days=7`)
      const data = await response.json()
      const generatedAlerts = generateWeatherAlerts(data.forecast || [], {})
      setAlerts(generatedAlerts)
    } catch (error) {
      console.error("[v0] Error loading weather alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "rain":
        return <CloudRain className="h-5 w-5" />
      case "heat":
        return <Thermometer className="h-5 w-5" />
      case "cold":
      case "frost":
        return <Snowflake className="h-5 w-5" />
      case "wind":
        return <Wind className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getAlertVariant = (severity: string): "default" | "destructive" => {
    return severity === "high" ? "destructive" : "default"
  }

  if (loading || alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={getAlertVariant(alert.severity)}>
          {getAlertIcon(alert.type)}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
