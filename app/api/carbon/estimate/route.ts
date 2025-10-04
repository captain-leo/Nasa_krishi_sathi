import { NextResponse } from "next/server"
import { estimateCredits, type CropType } from "@/lib/carbon"

// We keep Turf on the server to avoid shipping it to the client
import area from "@turf/area"
import type { Feature, Polygon, MultiPolygon } from "geojson"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const crop = (body?.crop || "mixed") as CropType

    let hectares = Number(body?.hectares || 0)

    // If a geometry is provided, use it to compute area (m^2 → ha)
    if (!hectares && body?.geometry) {
      const geom = body.geometry as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
      const geomFeature: Feature<Polygon | MultiPolygon> =
        "type" in geom && geom.type === "Feature"
          ? (geom as Feature<Polygon | MultiPolygon>)
          : ({ type: "Feature", geometry: geom as Polygon | MultiPolygon, properties: {} } as Feature<
              Polygon | MultiPolygon
            >)

      const m2 = area(geomFeature)
      hectares = m2 / 10000
    }

    if (!hectares || Number.isNaN(hectares) || hectares <= 0) {
      return NextResponse.json({ error: "Provide hectares > 0 or a valid GeoJSON geometry" }, { status: 400 })
    }

    const result = estimateCredits(hectares, crop)
    return NextResponse.json({ hectares, crop, ...result })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to estimate credits" }, { status: 500 })
  }
}
