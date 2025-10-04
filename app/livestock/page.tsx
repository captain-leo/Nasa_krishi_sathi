"use client"

import { useState } from "react"
import { LIVESTOCK_DEFAULTS, type LivestockItem } from "@/data/livestock"

export default function LivestockPage() {
  const [list, setList] = useState<LivestockItem[]>(LIVESTOCK_DEFAULTS)
  const [custom, setCustom] = useState<LivestockItem>({ type: "", dailyFeedKg: 0, waterLiters: 0, notes: "" })
  const add = () => {
    if (!custom.type) return
    setList((l) => [...l, custom])
    setCustom({ type: "", dailyFeedKg: 0, waterLiters: 0, notes: "" })
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Livestock Manager</h1>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <input
          className="border rounded px-2 py-1"
          placeholder="Type"
          value={custom.type}
          onChange={(e) => setCustom((c) => ({ ...c, type: e.target.value }))}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Feed (kg/day)"
          type="number"
          value={custom.dailyFeedKg}
          onChange={(e) => setCustom((c) => ({ ...c, dailyFeedKg: Number(e.target.value) }))}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Water (L/day)"
          type="number"
          value={custom.waterLiters}
          onChange={(e) => setCustom((c) => ({ ...c, waterLiters: Number(e.target.value) }))}
        />
        <input
          className="border rounded px-2 py-1 md:col-span-3"
          placeholder="Notes"
          value={custom.notes}
          onChange={(e) => setCustom((c) => ({ ...c, notes: e.target.value }))}
        />
        <button onClick={add} className="bg-blue-600 text-white px-3 py-2 rounded md:col-span-3">
          Add
        </button>
      </div>

      <div className="grid gap-3">
        {list.map((it, i) => (
          <div key={i} className="border rounded p-3">
            <div className="font-medium">{it.type}</div>
            <div className="text-sm text-stone-600">
              Feed: {it.dailyFeedKg} kg/day • Water: {it.waterLiters} L/day
            </div>
            {it.notes ? <div className="text-sm mt-1">{it.notes}</div> : null}
          </div>
        ))}
      </div>
    </main>
  )
}
