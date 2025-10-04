"use client"

import { useMemo, useState } from "react"
import { LIVESTOCK_DATA, type LivestockCategory } from "@/data/livestock-requirements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LivestockManager() {
  const categories = LIVESTOCK_DATA.livestock_categories
  const [categoryId, setCategoryId] = useState(categories[0]?.category_id ?? "")
  const [season, setSeason] = useState<"summer" | "monsoon" | "winter">("summer")

  const selected: LivestockCategory | undefined = useMemo(
    () => categories.find((c) => c.category_id === categoryId) ?? categories[0],
    [categories, categoryId],
  )

  const seasonalTips = LIVESTOCK_DATA.seasonal_considerations[season] ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Livestock Requirements</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-3">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label>Season</Label>
          <Select value={season} onValueChange={(v) => setSeason(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summer">Summer</SelectItem>
              <SelectItem value="monsoon">Monsoon</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 grid gap-2 rounded-md border p-3">
          <div className="font-medium">Housing</div>
          <div className="text-sm text-muted-foreground">
            Space: {selected?.requirements.housing.space_per_animal}, Flooring:{" "}
            {selected?.requirements.housing.flooring}
          </div>
        </div>

        <div className="grid gap-2 rounded-md border p-3">
          <div className="font-medium">Feeding</div>
          <div className="text-sm text-muted-foreground">
            Diet: {selected?.requirements.feeding.diet}
            {selected?.requirements.feeding.daily_intake_kg ? (
              <> — Daily intake: {selected?.requirements.feeding.daily_intake_kg}</>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2 rounded-md border p-3">
          <div className="font-medium">Healthcare</div>
          <div className="text-sm text-muted-foreground">
            Vaccinations: {selected?.requirements.healthcare.vaccinations.join(", ")}
            {selected?.requirements.healthcare.notes ? <> — {selected?.requirements.healthcare.notes}</> : null}
          </div>
        </div>

        <div className="md:col-span-2 grid gap-2 rounded-md border p-3">
          <div className="font-medium">Seasonal Tips</div>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            {seasonalTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
