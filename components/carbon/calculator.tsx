"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FARMER_PRICE_RANGE, INDUSTRY_PRICE_RANGE, type CropType } from "@/lib/carbon"

const fetcher = (url: string, opts?: any) => fetch(url, opts).then((r) => r.json())

export function CarbonCalculator() {
  const [hectares, setHectares] = useState<string>("")
  const [crop, setCrop] = useState<CropType>("mixed")
  const [geojson, setGeojson] = useState<string>("")
  const [result, setResult] = useState<any>(null)

  const [side, setSide] = useState<"farmer" | "industry">("farmer")
  const [unitPrice, setUnitPrice] = useState<number>(FARMER_PRICE_RANGE.min)

  const allowedMin = side === "industry" ? INDUSTRY_PRICE_RANGE.min : FARMER_PRICE_RANGE.min
  const allowedMax = side === "industry" ? INDUSTRY_PRICE_RANGE.max : FARMER_PRICE_RANGE.max

  const onEstimate = async () => {
    try {
      let geometry: any = null
      if (geojson.trim()) {
        try {
          geometry = JSON.parse(geojson)
        } catch {
          alert("Invalid GeoJSON")
          return
        }
      }

      const body: any = { crop }
      if (geometry) body.geometry = geometry
      const numericHectares = Number(hectares)
      if (!geometry && numericHectares > 0) body.hectares = numericHectares

      const res = await fetch("/api/carbon/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed")
      setResult(data)
      if (!hectares && data?.hectares) setHectares(String(data.hectares.toFixed(3)))
    } catch (e: any) {
      alert(e.message)
    }
  }

  const onCreateTransaction = async () => {
    try {
      const numericHectares = Number(hectares)
      if (!numericHectares || numericHectares <= 0) {
        alert("Enter hectares or provide a valid GeoJSON for estimation first.")
        return
      }
      if (unitPrice < allowedMin || unitPrice > allowedMax) {
        alert(`Unit price must be between ${allowedMin} and ${allowedMax} USD`)
        return
      }

      const res = await fetch("/api/carbon/transactions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          hectares: numericHectares,
          crop,
          side,
          unit_price: unitPrice,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to create transaction")
      alert("Transaction created.")
      // Fire a SWR revalidation event by mutating the key used in table component (window event)
      window.dispatchEvent(new CustomEvent("carbon-tx-refresh"))
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Crop Type</Label>
          <Select value={crop} onValueChange={(v) => setCrop(v as CropType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mixed">Mixed</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="maize">Maize</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Area (ha)</Label>
          <Input
            inputMode="decimal"
            value={hectares}
            onChange={(e) => setHectares(e.target.value)}
            placeholder="e.g., 2.5"
          />
          <p className="text-xs text-muted-foreground">Or paste GeoJSON below and click Estimate.</p>
        </div>

        <div className="space-y-2">
          <Label>Transaction Side</Label>
          <Select value={side} onValueChange={(v) => setSide(v as "farmer" | "industry")}>
            <SelectTrigger>
              <SelectValue placeholder="Select side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="farmer">
                Farmer (sell at ${FARMER_PRICE_RANGE.min}-{FARMER_PRICE_RANGE.max})
              </SelectItem>
              <SelectItem value="industry">
                Industry (buy at ${INDUSTRY_PRICE_RANGE.min}-{INDUSTRY_PRICE_RANGE.max})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>GeoJSON (Polygon or MultiPolygon)</Label>
        <textarea
          className="w-full min-h-28 rounded-md border bg-background p-2 text-sm"
          placeholder='{"type":"Polygon","coordinates":[...]}'
          value={geojson}
          onChange={(e) => setGeojson(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onEstimate}>Estimate credits</Button>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Unit Price (USD)</Label>
          <Input
            className="w-28"
            inputMode="decimal"
            value={String(unitPrice)}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            placeholder={`${allowedMin}-${allowedMax}`}
          />
          <span className="text-xs text-muted-foreground">
            Allowed: {allowedMin}-{allowedMax}
          </span>
        </div>
        <Button variant="secondary" onClick={onCreateTransaction}>
          Create transaction
        </Button>
      </div>

      {result && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-3">
            <h3 className="font-medium">Estimate</h3>
            <p className="text-sm text-muted-foreground">Hectares: {Number(result.hectares).toFixed(3)}</p>
            <p className="text-sm text-muted-foreground">Credits: {Number(result.credits).toFixed(3)} tCO₂e</p>
            <p className="text-sm text-muted-foreground">Method rate: {Number(result.rate).toFixed(2)} tCO₂e/ha</p>
          </Card>
          <Card className="p-3">
            <h3 className="font-medium">Farmer Valuation</h3>
            <p className="text-sm">
              Range: ${Number(result.farmer.min).toFixed(2)} – ${Number(result.farmer.max).toFixed(2)}
            </p>
          </Card>
          <Card className="p-3">
            <h3 className="font-medium">Industry Valuation</h3>
            <p className="text-sm">
              Range: ${Number(result.industry.min).toFixed(2)} – ${Number(result.industry.max).toFixed(2)}
            </p>
          </Card>
        </div>
      )}
    </Card>
  )
}
