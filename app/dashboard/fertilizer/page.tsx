"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

function getSupabase() {
  // Singleton-ish per component instance
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export default function FertilizerPage() {
  const supabase = useMemo(getSupabase, [])
  const { data: crops, isLoading: cropsLoading } = useSWR("farm_crops", async () => {
    const { data, error } = await supabase
      .from("farm_crops")
      .select("id, crop_type_id, planting_date, expected_harvest_date, area_hectares")
      .order("planting_date", { ascending: false })
    if (error) throw error
    return data || []
  })

  const {
    data: applications,
    isLoading: appsLoading,
    mutate,
  } = useSWR("fertilizer_applications", async () => {
    const { data, error } = await supabase
      .from("fertilizer_applications")
      .select("*")
      .order("application_date", { ascending: false })
    if (error) throw error
    return data || []
  })

  const [form, setForm] = useState<{
    farm_crop_id: string | null
    application_date: string
    fertilizer_type: string
    npk_ratio: string
    amount_kg: string
    notes: string
  }>({
    farm_crop_id: null,
    application_date: new Date().toISOString().slice(0, 10),
    fertilizer_type: "",
    npk_ratio: "",
    amount_kg: "",
    notes: "",
  })

  const onCreate = async () => {
    if (!form.farm_crop_id) return
    const payload = {
      farm_crop_id: form.farm_crop_id,
      application_date: form.application_date,
      fertilizer_type: form.fertilizer_type || null,
      npk_ratio: form.npk_ratio || null,
      amount_kg: form.amount_kg ? Number(form.amount_kg) : null,
      notes: form.notes || null,
    }
    const { error } = await supabase.from("fertilizer_applications").insert(payload)
    if (error) {
      console.error("[v0] insert fertilizer error:", error.message)
      return
    }
    setForm((f) => ({ ...f, fertilizer_type: "", npk_ratio: "", amount_kg: "", notes: "" }))
    mutate()
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-semibold">Fertilizer Applications</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Application</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Farm Crop</Label>
              <Select
                value={form.farm_crop_id ?? ""}
                onValueChange={(v) => setForm((f) => ({ ...f, farm_crop_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={cropsLoading ? "Loading..." : "Select crop"} />
                </SelectTrigger>
                <SelectContent>
                  {crops?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.crop_type_id} — {c.area_hectares} ha
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Application Date</Label>
              <Input
                type="date"
                value={form.application_date}
                onChange={(e) => setForm((f) => ({ ...f, application_date: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Fertilizer Type</Label>
              <Input
                placeholder="Urea / DAP / Compost ..."
                value={form.fertilizer_type}
                onChange={(e) => setForm((f) => ({ ...f, fertilizer_type: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>NPK Ratio</Label>
              <Input
                placeholder="e.g. 46-0-0"
                value={form.npk_ratio}
                onChange={(e) => setForm((f) => ({ ...f, npk_ratio: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Amount (kg)</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={form.amount_kg}
                onChange={(e) => setForm((f) => ({ ...f, amount_kg: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Optional notes..."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>

            <Button onClick={onCreate} disabled={!form.farm_crop_id}>
              Save Application
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : applications?.length ? (
              <ul className="grid gap-3">
                {applications.map((a: any) => (
                  <li key={a.id} className="rounded-md border p-3">
                    <div className="text-sm">
                      <span className="font-medium">{a.fertilizer_type || "—"}</span>{" "}
                      <span className="text-muted-foreground">({a.npk_ratio || "—"})</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {a.application_date} — {a.amount_kg ?? "—"} kg
                    </div>
                    {a.notes ? <div className="mt-1 text-xs">{a.notes}</div> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No applications yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
