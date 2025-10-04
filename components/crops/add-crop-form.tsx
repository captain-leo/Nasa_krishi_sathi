"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sprout, Calendar, TrendingUp, Droplets, Info } from "lucide-react"
import Link from "next/link"

interface CropType {
  id: string
  name: string
  growth_stages: any[]
  environmental_requirements: any
  resource_consumption: any
  yield_metrics: any
}

interface AddCropFormProps {
  farm: any
  cropTypes: CropType[]
}

export function AddCropForm({ farm, cropTypes }: AddCropFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null)
  const [plantingDate, setPlantingDate] = useState("")
  const [areaHectares, setAreaHectares] = useState("")

  const selectedCrop = cropTypes.find((c) => c.id === selectedCropId)

  // Calculate expected harvest date based on growth stages
  const calculateHarvestDate = (plantingDate: string, growthStages: any[]) => {
    if (!plantingDate || !growthStages) return null
    const totalDays = growthStages.reduce((sum, stage) => sum + (stage.durationDays || 0), 0)
    const date = new Date(plantingDate)
    date.setDate(date.getDate() + totalDays)
    return date.toISOString().split("T")[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCropId) {
      setError("Please select a crop")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const expectedHarvestDate = calculateHarvestDate(plantingDate, selectedCrop?.growth_stages || [])

      const { error: insertError } = await supabase.from("farm_crops").insert({
        farm_id: farm.id,
        crop_type_id: selectedCropId,
        planting_date: plantingDate,
        expected_harvest_date: expectedHarvestDate,
        area_hectares: Number.parseFloat(areaHectares),
        current_stage: selectedCrop?.growth_stages[0]?.stage || "Planting",
        status: "active",
      })

      if (insertError) throw insertError

      router.push(`/dashboard/farms/${farm.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add crop")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mb-6">
        <Button asChild variant="ghost">
          <Link href={`/dashboard/farms/${farm.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Farm
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Crop Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Add Crop to {farm.name}</CardTitle>
              <CardDescription>Select a crop and enter planting details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Select Crop Type *</Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {cropTypes.map((crop) => (
                      <Card
                        key={crop.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedCropId === crop.id ? "ring-2 ring-green-600 bg-green-50" : ""
                        }`}
                        onClick={() => setSelectedCropId(crop.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Sprout
                              className={`h-6 w-6 ${selectedCropId === crop.id ? "text-green-600" : "text-muted-foreground"}`}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold">{crop.name}</h3>
                              <p className="text-xs text-muted-foreground">{crop.growth_stages.length} growth stages</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plantingDate">Planting Date *</Label>
                    <Input
                      id="plantingDate"
                      type="date"
                      required
                      value={plantingDate}
                      onChange={(e) => setPlantingDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Area (Hectares) *</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 1.5"
                      required
                      value={areaHectares}
                      onChange={(e) => setAreaHectares(e.target.value)}
                    />
                  </div>
                </div>

                {selectedCrop && plantingDate && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Expected Harvest Date</p>
                        <p className="text-sm text-blue-700">
                          {new Date(
                            calculateHarvestDate(plantingDate, selectedCrop.growth_stages) || "",
                          ).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Total growing period:{" "}
                          {selectedCrop.growth_stages.reduce((sum, stage) => sum + stage.durationDays, 0)} days
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Crop"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Crop Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedCrop ? (
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  {selectedCrop.name}
                </CardTitle>
                <CardDescription>Crop Requirements & Information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Environmental Requirements */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Environment
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="font-medium">
                        {selectedCrop.environmental_requirements.temperatureRangeCelsius}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rainfall:</span>
                      <span className="font-medium">{selectedCrop.environmental_requirements.rainfallMM} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">pH Range:</span>
                      <span className="font-medium">{selectedCrop.environmental_requirements.phRange}</span>
                    </div>
                  </div>
                </div>

                {/* Resource Consumption */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Resources
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Water Demand:</span>
                      <Badge variant="outline">{selectedCrop.resource_consumption.waterDemand}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fertilizer:</span>
                      <Badge variant="outline">{selectedCrop.resource_consumption.fertilizerDemand}</Badge>
                    </div>
                  </div>
                </div>

                {/* Yield Metrics */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expected Yield
                  </h4>
                  <p className="text-sm">
                    <span className="font-bold text-green-700">
                      {selectedCrop.yield_metrics.averageYieldKgPerHectare?.toLocaleString() ||
                        selectedCrop.yield_metrics.averageYieldKgGreenBeanPerHectare?.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground"> kg/hectare</span>
                  </p>
                </div>

                {/* Growth Stages */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Growth Stages</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedCrop.growth_stages.map((stage, index) => (
                      <div key={index} className="text-xs p-2 bg-muted rounded">
                        <div className="font-medium">{stage.stage}</div>
                        <div className="text-muted-foreground">{stage.durationDays} days</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Select a crop to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
