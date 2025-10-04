export type CropType = "rice" | "wheat" | "maize" | "mixed" | "other"

export const FARMER_PRICE_RANGE = { min: 12, max: 14 } // USD/credit
export const INDUSTRY_PRICE_RANGE = { min: 18, max: 19 } // USD/credit

// Approximate sequestration rates (tCO2e per hectare per year)
// These are placeholder defaults; replace with calibrated factors per region/crop when available.
export const SEQUESTRATION_BY_CROP: Record<CropType, number> = {
  rice: 3.0,
  wheat: 2.0,
  maize: 2.2,
  mixed: 2.5,
  other: 2.0,
}

export function estimateCredits(hectares: number, crop: CropType = "mixed") {
  const rate = SEQUESTRATION_BY_CROP[crop] ?? SEQUESTRATION_BY_CROP.mixed
  const credits = Math.max(0, hectares) * rate
  // valuations
  const farmer = {
    min: credits * FARMER_PRICE_RANGE.min,
    max: credits * FARMER_PRICE_RANGE.max,
  }
  const industry = {
    min: credits * INDUSTRY_PRICE_RANGE.min,
    max: credits * INDUSTRY_PRICE_RANGE.max,
  }
  return { credits, farmer, industry, rate }
}
