"use client"

import { useEffect, useRef, useState } from "react"
import maplibregl, { type Map as MLMap } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type GeoJSON from "geojson"

// Lazy import turf only on client
async function calcAreaHectares(coordsLngLat: [number, number][]) {
  const turf = await import("@turf/turf")
  // Close polygon if user hasn't closed it
  const ring =
    coordsLngLat[0] === coordsLngLat[coordsLngLat.length - 1] ? coordsLngLat : [...coordsLngLat, coordsLngLat[0]]
  const polygon = turf.polygon([ring])
  const sqm = turf.area(polygon)
  const hectares = sqm / 10000
  return { sqm, hectares, polygon }
}

export default function MRVMap() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<MLMap | null>(null)
  const [points, setPoints] = useState<[number, number][]>([])
  const [area, setArea] = useState<{ sqm: number; hectares: number } | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [77.2, 28.61], // Delhi default
      zoom: 8,
      attributionControl: true,
    })
    map.addControl(new maplibregl.NavigationControl(), "top-right")
    map.on("click", (e) => {
      const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat]
      setPoints((prev) => [...prev, lngLat])
    })
    mapInstance.current = map
    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  // Render geometry layers when points change
  useEffect(() => {
    const map = mapInstance.current
    if (!map) return
    const id = "mrv-area"
    const sourceId = "mrv-area-src"

    // Update points layer (markers)
    // Simple circle layer via GeoJSON
    const pointsFC: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: points.map((p) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: p },
        properties: {},
      })),
    }

    const polygon =
      points.length >= 3
        ? {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [[...points, points[0]]],
            },
            properties: {},
          }
        : null

    // Update/Set polygon
    const src = map.getSource(sourceId) as any
    const data = polygon
      ? {
          type: "FeatureCollection",
          features: [polygon, ...pointsFC.features],
        }
      : pointsFC

    if (src) {
      src.setData(data)
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data,
      })
      map.addLayer({
        id: `${id}-fill`,
        type: "fill",
        source: sourceId,
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": "#22c55e",
          "fill-opacity": 0.25,
        },
      })
      map.addLayer({
        id: `${id}-line`,
        type: "line",
        source: sourceId,
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "line-color": "#16a34a",
          "line-width": 2,
        },
      })
      map.addLayer({
        id: `${id}-points`,
        type: "circle",
        source: sourceId,
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-radius": 4,
          "circle-color": "#0ea5e9",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#075985",
        },
      })
    }
  }, [points])

  const onComplete = async () => {
    if (points.length < 3) return
    const res = await calcAreaHectares(points)
    setArea({ sqm: res.sqm, hectares: res.hectares })
  }

  const onReset = () => {
    setPoints([])
    setArea(null)
    const map = mapInstance.current
    const sourceId = "mrv-area-src"
    if (map && map.getSource(sourceId)) {
      ;(map.getSource(sourceId) as any).setData({
        type: "FeatureCollection",
        features: [],
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-pretty">MRV: Land Measurement & Area</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-2">
          <Button onClick={onComplete} variant="default">
            Complete Polygon
          </Button>
          <Button onClick={onReset} variant="secondary">
            Reset
          </Button>
        </div>
        <div ref={mapRef} className="h-[480px] w-full rounded-md border" />
        {area ? (
          <div className="mt-3 text-sm">
            <div>Area: {area.hectares.toFixed(4)} ha</div>
            <div>({area.sqm.toFixed(0)} m²)</div>
          </div>
        ) : (
          <div className="mt-3 text-sm text-muted-foreground">
            Click to add vertices. At least 3 points are required to form a polygon.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
