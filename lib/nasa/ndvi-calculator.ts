// NDVI Calculation and Simulation
// In production, this would fetch from Landsat/Sentinel-2 APIs

export function calculateNDVI(red: number, nir: number): number {
  // NDVI = (NIR - Red) / (NIR + Red)
  if (nir + red === 0) return 0
  return (nir - red) / (nir + red)
}

export function simulateNDVIData(lat: number, lon: number, cropType: string, daysSincePlanting: number) {
  // Simulate NDVI based on crop growth stage
  // In production, this would fetch real satellite data

  let baseNDVI = 0.2 // Bare soil

  // Simulate growth curve
  if (daysSincePlanting < 20) {
    // Early growth
    baseNDVI = 0.2 + (daysSincePlanting / 20) * 0.3
  } else if (daysSincePlanting < 60) {
    // Vegetative growth
    baseNDVI = 0.5 + ((daysSincePlanting - 20) / 40) * 0.3
  } else if (daysSincePlanting < 100) {
    // Peak growth
    baseNDVI = 0.8 + Math.random() * 0.1
  } else {
    // Senescence
    baseNDVI = 0.8 - ((daysSincePlanting - 100) / 30) * 0.4
  }

  // Add some random variation
  const ndvi = Math.max(0, Math.min(1, baseNDVI + (Math.random() - 0.5) * 0.1))

  return {
    ndvi: Number.parseFloat(ndvi.toFixed(3)),
    quality: ndvi > 0.7 ? "Excellent" : ndvi > 0.5 ? "Good" : ndvi > 0.3 ? "Fair" : "Poor",
    date: new Date().toISOString().split("T")[0],
  }
}

export function simulateSoilMoisture(lat: number, lon: number, recentRainfall: number) {
  // Simulate soil moisture based on location and rainfall
  // In production, this would fetch from NASA SMAP

  let baseMoisture = 30 // Base soil moisture percentage

  // Adjust based on recent rainfall
  if (recentRainfall > 50) {
    baseMoisture = 70 + Math.random() * 20
  } else if (recentRainfall > 20) {
    baseMoisture = 50 + Math.random() * 20
  } else if (recentRainfall > 5) {
    baseMoisture = 35 + Math.random() * 15
  } else {
    baseMoisture = 15 + Math.random() * 15
  }

  return {
    soilMoisture: Number.parseFloat(baseMoisture.toFixed(1)),
    status: baseMoisture > 60 ? "Saturated" : baseMoisture > 40 ? "Adequate" : baseMoisture > 20 ? "Low" : "Very Low",
    date: new Date().toISOString().split("T")[0],
  }
}

export function generateHealthScore(ndvi: number, soilMoisture: number, temperature: number, optimalTemp: number) {
  let score = 0

  // NDVI contribution (40%)
  if (ndvi > 0.7) score += 40
  else if (ndvi > 0.5) score += 30
  else if (ndvi > 0.3) score += 20
  else score += 10

  // Soil moisture contribution (30%)
  if (soilMoisture > 40 && soilMoisture < 70) score += 30
  else if (soilMoisture > 30 && soilMoisture < 80) score += 20
  else score += 10

  // Temperature contribution (30%)
  const tempDiff = Math.abs(temperature - optimalTemp)
  if (tempDiff < 3) score += 30
  else if (tempDiff < 5) score += 20
  else if (tempDiff < 8) score += 10
  else score += 5

  return Math.min(100, Math.max(0, score))
}
