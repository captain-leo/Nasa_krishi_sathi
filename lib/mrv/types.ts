// MRV (Measurement, Reporting, Verification) Types

export interface MRVMetrics {
  farmId: string
  reportingPeriod: {
    startDate: string
    endDate: string
  }
  carbonSequestration: {
    totalCO2Sequestered: number // in kg
    perHectare: number
    methodology: string
  }
  waterUsage: {
    totalWaterUsed: number // in liters
    perHectare: number
    efficiency: number // percentage
    savedVsTraditional: number // percentage
  }
  fertilizer: {
    totalUsed: number // in kg
    perHectare: number
    organicPercentage: number
    reductionVsBaseline: number // percentage
  }
  pesticides: {
    totalUsed: number // in liters
    perHectare: number
    organicPercentage: number
    reductionVsBaseline: number // percentage
  }
  biodiversity: {
    cropDiversity: number // number of different crops
    soilHealthScore: number // 0-100
    pollinatorFriendly: boolean
  }
  sustainability: {
    overallScore: number // 0-100
    certificationEligible: boolean
    improvements: string[]
  }
}

export interface CarbonCalculation {
  cropType: string
  area: number
  biomassProduction: number
  carbonContent: number
  sequestrationRate: number
}
