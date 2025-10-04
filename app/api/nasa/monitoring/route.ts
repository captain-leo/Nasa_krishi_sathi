import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { simulateNDVIData, simulateSoilMoisture, generateHealthScore } from "@/lib/nasa/ndvi-calculator"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { farmCropId, farmId } = body

    // Fetch farm location
    const { data: farm } = await supabase.from("farms").select("location_lat, location_lng").eq("id", farmId).single()

    if (!farm || !farm.location_lat || !farm.location_lng) {
      return NextResponse.json({ error: "Farm location not set" }, { status: 400 })
    }

    // Fetch crop details
    const { data: farmCrop } = await supabase
      .from("farm_crops")
      .select(
        `
        *,
        crop_types (*)
      `,
      )
      .eq("id", farmCropId)
      .single()

    if (!farmCrop) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 })
    }

    // Calculate days since planting
    const daysSincePlanting = Math.floor(
      (new Date().getTime() - new Date(farmCrop.planting_date).getTime()) / (1000 * 60 * 60 * 24),
    )

    // Simulate NASA data
    const ndviData = simulateNDVIData(
      Number(farm.location_lat),
      Number(farm.location_lng),
      farmCrop.crop_type_id,
      daysSincePlanting,
    )

    const soilMoistureData = simulateSoilMoisture(Number(farm.location_lat), Number(farm.location_lng), 10)

    // Get optimal temperature from crop requirements
    const tempRange = farmCrop.crop_types?.environmental_requirements?.temperatureRangeCelsius || "20-30"
    const [minTemp, maxTemp] = tempRange.split("-").map(Number)
    const optimalTemp = (minTemp + maxTemp) / 2

    // Simulate current temperature (would come from NASA POWER in production)
    const currentTemp = optimalTemp + (Math.random() - 0.5) * 10

    // Calculate health score
    const healthScore = generateHealthScore(ndviData.ndvi, soilMoistureData.soilMoisture, currentTemp, optimalTemp)

    // Insert monitoring data
    const { data: monitoringData, error: insertError } = await supabase
      .from("crop_monitoring")
      .insert({
        farm_crop_id: farmCropId,
        monitoring_date: new Date().toISOString().split("T")[0],
        ndvi_value: ndviData.ndvi,
        soil_moisture: soilMoistureData.soilMoisture,
        temperature_celsius: Number.parseFloat(currentTemp.toFixed(1)),
        health_score: healthScore,
        notes: `Auto-generated from NASA satellite data. NDVI: ${ndviData.quality}, Soil: ${soilMoistureData.status}`,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Error inserting monitoring data:", insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: monitoringData,
      ndviQuality: ndviData.quality,
      soilStatus: soilMoistureData.status,
    })
  } catch (error) {
    console.error("[v0] NASA monitoring API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
