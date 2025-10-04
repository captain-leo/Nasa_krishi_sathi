// Weather and AQI Types

export interface WeatherData {
  date: string
  temperature: number
  temperatureMin: number
  temperatureMax: number
  humidity: number
  precipitation: number
  windSpeed: number
  condition: string
  icon: string
}

export interface AQIData {
  date: string
  aqi: number
  category: "Good" | "Moderate" | "Unhealthy for Sensitive Groups" | "Unhealthy" | "Very Unhealthy" | "Hazardous"
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
}

export interface WeatherAlert {
  id: string
  type: "rain" | "heat" | "cold" | "wind" | "frost"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  startDate: string
  endDate: string
}
