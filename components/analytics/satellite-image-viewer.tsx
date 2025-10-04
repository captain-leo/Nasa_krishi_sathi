"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface SatelliteImageViewerProps {
  lat: number
  lon: number
}

export function SatelliteImageViewer({ lat, lon }: SatelliteImageViewerProps) {
  const [imageType, setImageType] = useState<"RGB" | "NDVI" | "NDWI">("RGB")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadImage()
  }, [imageType, lat, lon])

  const loadImage = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/nasa/satellite-image?lat=${lat}&lon=${lon}&type=${imageType}`)
      const data = await response.json()
      setImageUrl(data.imageUrl)
    } catch (error) {
      console.error("[v0] Error loading satellite image:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={imageType} onValueChange={(value) => setImageType(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="RGB">True Color</TabsTrigger>
          <TabsTrigger value="NDVI">NDVI</TabsTrigger>
          <TabsTrigger value="NDWI">Water Index</TabsTrigger>
        </TabsList>

        <TabsContent value={imageType} className="mt-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : imageUrl ? (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={`Satellite ${imageType} view`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Location: {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
        </span>
        <Button variant="outline" size="sm" onClick={loadImage} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
        <p className="font-medium text-blue-900 mb-1">About {imageType}</p>
        {imageType === "RGB" && (
          <p className="text-blue-700">True color satellite imagery showing actual ground appearance</p>
        )}
        {imageType === "NDVI" && (
          <p className="text-blue-700">
            Vegetation health index: Higher values (green) indicate healthier crops, lower values (red) indicate stress
          </p>
        )}
        {imageType === "NDWI" && (
          <p className="text-blue-700">Water content index: Shows moisture levels in vegetation and soil</p>
        )}
      </div>
    </div>
  )
}
