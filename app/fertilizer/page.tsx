"use client"

import type React from "react"

import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function FertilizerPage() {
  const { data, mutate } = useSWR("/api/fertilizer", fetcher)
  const [form, setForm] = useState({
    farm_id: "",
    crop: "",
    fertilizer_type: "",
    amount_kg: "",
    applied_at: "",
    notes: "",
  })
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/fertilizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ farm_id: "", crop: "", fertilizer_type: "", amount_kg: "", applied_at: "", notes: "" })
      mutate()
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Fertilizer Dashboard</h1>

      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3 mb-6">
        <input
          name="farm_id"
          placeholder="Farm ID"
          className="border rounded px-2 py-1"
          value={form.farm_id}
          onChange={onChange}
        />
        <input
          name="crop"
          placeholder="Crop"
          className="border rounded px-2 py-1"
          value={form.crop}
          onChange={onChange}
        />
        <input
          name="fertilizer_type"
          placeholder="Fertilizer Type"
          className="border rounded px-2 py-1"
          value={form.fertilizer_type}
          onChange={onChange}
        />
        <input
          name="amount_kg"
          placeholder="Amount (kg)"
          className="border rounded px-2 py-1"
          value={form.amount_kg}
          onChange={onChange}
        />
        <input
          name="applied_at"
          placeholder="Applied Date (YYYY-MM-DD)"
          className="border rounded px-2 py-1"
          value={form.applied_at}
          onChange={onChange}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          className="border rounded px-2 py-1 md:col-span-3"
          value={form.notes}
          onChange={onChange}
        />
        <button className="bg-green-600 text-white px-3 py-2 rounded md:col-span-3">Add Application</button>
      </form>

      <div className="grid gap-3">
        {(data || []).map((row: any) => (
          <div key={row.id} className="border rounded p-3">
            <div className="font-medium">
              {row.crop} • {row.fertilizer_type} • {row.amount_kg} kg
            </div>
            <div className="text-sm text-stone-600">
              Farm: {row.farm_id} • Date: {row.applied_at}
            </div>
            {row.notes ? <div className="text-sm mt-1">{row.notes}</div> : null}
          </div>
        ))}
      </div>
    </main>
  )
}
