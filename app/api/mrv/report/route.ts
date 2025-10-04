import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  calculateCarbonSequestration,
  calculateWaterEfficiency,
  calculateSustainabilityScore,
  generateMRVRecommendations,
} from "@/lib/mrv/calculator"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const farmId = searchParams.get("farmId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!farmId || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Fetch farm details
    const { data: farm } = await supabase.from("farms").select("*").eq("id", farmId).eq("user_id", user.id).single()

    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 })
    }

    // Fetch farm crops in the period
    const { data: farmCrops } = await supabase
      .from("farm_crops")
      .select(
        `
        *,
        crop_types (*)
      `,
      )
      .eq("farm_id", farmId)
      .gte("planting_date", startDate)
      .lte("planting_date", endDate)

    // Fetch irrigation events
    const cropIds = farmCrops?.map((c) => c.id) || []
    const { data: irrigationEvents } = await supabase
      .from("irrigation_events")
      .select("*")
      .in("farm_crop_id", cropIds)
      .gte("event_date", startDate)
      .lte("event_date", endDate)

    // Fetch fertilizer applications
    const { data: fertilizerApps } = await supabase
      .from("fertilizer_applications")
      .select("*")
      .in("farm_crop_id", cropIds)
      .gte("application_date", startDate)
      .lte("application_date", endDate)

    // Calculate metrics
    let totalCarbonSequestered = 0
    let totalWaterUsed = 0
    let totalFertilizerUsed = 0
    let organicFertilizerUsed = 0

    // Carbon sequestration
    farmCrops?.forEach((crop) => {
      const daysSincePlanting = Math.floor(
        (new Date().getTime() - new Date(crop.planting_date).getTime()) / (1000 * 60 * 60 * 24),
      )
      const estimatedYield =
        (crop.crop_types?.yield_metrics?.averageYieldKgPerHectare ||
          crop.crop_types?.yield_metrics?.averageYieldKgGreenBeanPerHectare ||
          2000) * crop.area_hectares

      const carbon = calculateCarbonSequestration(
        crop.crop_type_id,
        crop.area_hectares,
        daysSincePlanting,
        estimatedYield,
      )
      totalCarbonSequestered += carbon
    })

    // Water usage
    irrigationEvents?.forEach((event) => {
      totalWaterUsed += event.water_amount_liters || 0
    })

    // Fertilizer usage
    fertilizerApps?.forEach((app) => {
      totalFertilizerUsed += app.amount_kg || 0
      if (
        app.fertilizer_type?.toLowerCase().includes("organic") ||
        app.fertilizer_type?.toLowerCase().includes("compost")
      ) {
        organicFertilizerUsed += app.amount_kg || 0
      }
    })

    const organicFertilizerPercentage =
      totalFertilizerUsed > 0 ? (organicFertilizerUsed / totalFertilizerUsed) * 100 : 0

    // Calculate water efficiency
    const totalYield = farmCrops?.reduce((sum, crop) => {
      return (
        sum +
        (crop.crop_types?.yield_metrics?.averageYieldKgPerHectare ||
          crop.crop_types?.yield_metrics?.averageYieldKgGreenBeanPerHectare ||
          2000) *
          crop.area_hectares
      )
    }, 0)

    const waterMetrics = calculateWaterEfficiency(totalWaterUsed, farm.area_hectares, "mixed", totalYield || 0)

    // Calculate sustainability score
    const sustainabilityScore = calculateSustainabilityScore({
      organicFertilizerPercentage,
      organicPesticidePercentage: 50, // Simulated
      waterEfficiency: waterMetrics.efficiency,
      cropDiversity: farmCrops?.length || 0,
      soilHealthScore: 75, // Simulated
    })

    const mrvMetrics = {
      farmId,
      reportingPeriod: {
        startDate,
        endDate,
      },
      carbonSequestration: {
        totalCO2Sequestered: totalCarbonSequestered,
        perHectare: totalCarbonSequestered / farm.area_hectares,
        methodology: "IPCC Tier 1 Simplified",
      },
      waterUsage: {
        totalWaterUsed,
        perHectare: totalWaterUsed / farm.area_hectares,
        efficiency: waterMetrics.efficiency,
        savedVsTraditional: waterMetrics.savedVsTraditional,
      },
      fertilizer: {
        totalUsed: totalFertilizerUsed,
        perHectare: totalFertilizerUsed / farm.area_hectares,
        organicPercentage: organicFertilizerPercentage,
        reductionVsBaseline: 15, // Simulated
      },
      pesticides: {
        totalUsed: 0, // Not tracked yet
        perHectare: 0,
        organicPercentage: 50,
        reductionVsBaseline: 20,
      },
      biodiversity: {
        cropDiversity: farmCrops?.length || 0,
        soilHealthScore: 75,
        pollinatorFriendly: true,
      },
      sustainability: {
        overallScore: sustainabilityScore,
        certificationEligible: sustainabilityScore >= 70,
        improvements: generateMRVRecommendations({
          carbonSequestration: {
            perHectare: totalCarbonSequestered / farm.area_hectares,
          },
          waterUsage: waterMetrics,
          fertilizer: {
            organicPercentage: organicFertilizerPercentage,
          },
          biodiversity: {
            cropDiversity: farmCrops?.length || 0,
          },
          sustainability: {
            overallScore: sustainabilityScore,
          },
        }),
      },
    }

    return NextResponse.json({ metrics: mrvMetrics })
  } catch (error) {
    console.error("[v0] MRV report API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
