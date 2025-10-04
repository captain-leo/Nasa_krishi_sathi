// MRV Calculations

export function calculateCarbonSequestration(
  cropType: string,
  areaHectares: number,
  growthDays: number,
  yieldKg: number,
): number {
  // Simplified carbon sequestration calculation
  // In production, this would use more sophisticated models

  // Average carbon content in crop biomass: ~45% of dry weight
  const carbonContent = 0.45

  // Estimate total biomass (including roots, stems, leaves)
  // Typically 2-3x the harvested yield
  const totalBiomass = yieldKg * 2.5

  // Carbon sequestered (kg CO2 equivalent)
  // CO2 = Carbon * 3.67 (molecular weight ratio)
  const carbonSequestered = totalBiomass * carbonContent * 3.67

  return Number.parseFloat(carbonSequestered.toFixed(2))
}

export function calculateWaterEfficiency(
  totalWaterUsed: number,
  areaHectares: number,
  cropType: string,
  yieldKg: number,
): {
  efficiency: number
  savedVsTraditional: number
} {
  // Water use efficiency: kg of crop per cubic meter of water
  const waterUsedCubicMeters = totalWaterUsed / 1000
  const efficiency = waterUsedCubicMeters > 0 ? yieldKg / waterUsedCubicMeters : 0

  // Compare with traditional irrigation (assume 30% more water usage)
  const traditionalWaterUsage = totalWaterUsed * 1.3
  const savedVsTraditional = ((traditionalWaterUsage - totalWaterUsed) / traditionalWaterUsage) * 100

  return {
    efficiency: Number.parseFloat(efficiency.toFixed(2)),
    savedVsTraditional: Number.parseFloat(savedVsTraditional.toFixed(1)),
  }
}

export function calculateSustainabilityScore(metrics: {
  organicFertilizerPercentage: number
  organicPesticidePercentage: number
  waterEfficiency: number
  cropDiversity: number
  soilHealthScore: number
}): number {
  let score = 0

  // Organic inputs (30%)
  score += (metrics.organicFertilizerPercentage / 100) * 15
  score += (metrics.organicPesticidePercentage / 100) * 15

  // Water efficiency (25%)
  score += Math.min(metrics.waterEfficiency / 4, 25)

  // Biodiversity (20%)
  score += Math.min(metrics.cropDiversity * 5, 10)
  score += (metrics.soilHealthScore / 100) * 10

  // Soil health (25%)
  score += (metrics.soilHealthScore / 100) * 25

  return Math.min(100, Math.round(score))
}

export function generateMRVRecommendations(metrics: any): string[] {
  const recommendations: string[] = []

  if (metrics.waterUsage.efficiency < 2) {
    recommendations.push("Consider drip irrigation to improve water efficiency")
  }

  if (metrics.fertilizer.organicPercentage < 50) {
    recommendations.push("Increase organic fertilizer usage for better soil health")
  }

  if (metrics.biodiversity.cropDiversity < 3) {
    recommendations.push("Implement crop rotation to improve biodiversity")
  }

  if (metrics.sustainability.overallScore < 60) {
    recommendations.push("Focus on sustainable practices to improve certification eligibility")
  }

  if (metrics.carbonSequestration.perHectare < 1000) {
    recommendations.push("Consider cover crops to increase carbon sequestration")
  }

  return recommendations
}
