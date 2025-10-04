// Weather API Integration (using NASA POWER and simulated data)

export async function fetchWeatherForecast(lat: number, lon: number, days = 7) {
  // In production, this would use NASA POWER API or OpenWeatherMap
  // For now, we'll simulate realistic weather data

  const forecast: any[] = []
  const today = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    // Simulate realistic Indian weather patterns
    const baseTemp = 28 + Math.sin(i / 7) * 5
    const tempVariation = Math.random() * 4

    forecast.push({
      date: date.toISOString().split("T")[0],
      temperature: Number.parseFloat((baseTemp + tempVariation).toFixed(1)),
      temperatureMin: Number.parseFloat((baseTemp - 3).toFixed(1)),
      temperatureMax: Number.parseFloat((baseTemp + 5).toFixed(1)),
      humidity: Math.floor(60 + Math.random() * 30),
      precipitation: Math.random() > 0.7 ? Number.parseFloat((Math.random() * 20).toFixed(1)) : 0,
      windSpeed: Number.parseFloat((5 + Math.random() * 10).toFixed(1)),
      condition: Math.random() > 0.7 ? "Rainy" : Math.random() > 0.5 ? "Cloudy" : "Sunny",
      icon: Math.random() > 0.7 ? "cloud-rain" : Math.random() > 0.5 ? "cloud" : "sun",
    })
  }

  return forecast
}

export async function fetchAQIData(lat: number, lon: number) {
  // In production, this would use NASA POWER or local AQI APIs
  // Simulate AQI data

  const aqi = Math.floor(50 + Math.random() * 100)

  let category: any = "Good"
  if (aqi > 300) category = "Hazardous"
  else if (aqi > 200) category = "Very Unhealthy"
  else if (aqi > 150) category = "Unhealthy"
  else if (aqi > 100) category = "Unhealthy for Sensitive Groups"
  else if (aqi > 50) category = "Moderate"

  return {
    date: new Date().toISOString().split("T")[0],
    aqi,
    category,
    pm25: Number.parseFloat((aqi * 0.4).toFixed(1)),
    pm10: Number.parseFloat((aqi * 0.6).toFixed(1)),
    o3: Number.parseFloat((aqi * 0.3).toFixed(1)),
    no2: Number.parseFloat((aqi * 0.2).toFixed(1)),
    so2: Number.parseFloat((aqi * 0.15).toFixed(1)),
    co: Number.parseFloat((aqi * 0.5).toFixed(1)),
  }
}

export function generateWeatherAlerts(forecast: any[], cropRequirements: any) {
  const alerts: any[] = []

  // Check for extreme temperatures
  forecast.forEach((day, index) => {
    if (day.temperatureMax > 40) {
      alerts.push({
        id: `heat-${index}`,
        type: "heat",
        severity: "high",
        title: "Extreme Heat Warning",
        description: `Temperature expected to reach ${day.temperatureMax}°C. Increase irrigation and provide shade if possible.`,
        startDate: day.date,
        endDate: day.date,
      })
    }

    if (day.temperatureMin < 10) {
      alerts.push({
        id: `cold-${index}`,
        type: "cold",
        severity: "medium",
        title: "Cold Weather Alert",
        description: `Temperature may drop to ${day.temperatureMin}°C. Protect sensitive crops from frost damage.`,
        startDate: day.date,
        endDate: day.date,
      })
    }

    if (day.precipitation > 50) {
      alerts.push({
        id: `rain-${index}`,
        type: "rain",
        severity: "medium",
        title: "Heavy Rainfall Expected",
        description: `${day.precipitation}mm of rain forecasted. Ensure proper drainage to prevent waterlogging.`,
        startDate: day.date,
        endDate: day.date,
      })
    }

    if (day.windSpeed > 30) {
      alerts.push({
        id: `wind-${index}`,
        type: "wind",
        severity: "medium",
        title: "Strong Wind Warning",
        description: `Wind speeds up to ${day.windSpeed} km/h expected. Secure loose structures and protect tall crops.`,
        startDate: day.date,
        endDate: day.date,
      })
    }
  })

  return alerts
}
