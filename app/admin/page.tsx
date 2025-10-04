"use client"

import Papa from "papaparse"
import { useState } from "react"

export default function AdminPage() {
  const [status, setStatus] = useState<string>("")

  const onUpload = async (file: File) => {
    setStatus("Uploading...")
    try {
      let payload: any = null
      if (file.name.endsWith(".csv")) {
        const text = await file.text()
        const parsed = Papa.parse(text, { header: true })
        payload = { type: "csv", name: file.name, rows: parsed.data }
      } else if (file.name.endsWith(".geojson") || file.name.endsWith(".json")) {
        const text = await file.text()
        const json = JSON.parse(text)
        payload = { type: "geojson", name: file.name, data: json }
      } else {
        setStatus("Unsupported file type")
        return
      }
      const res = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const out = await res.json()
      if (!res.ok) throw new Error(out?.error || "Upload failed")
      setStatus("Uploaded ✓")
    } catch (e: any) {
      setStatus(`Error: ${e.message}`)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Admin / Researcher</h1>
      <div className="border rounded p-4">
        <p className="text-sm mb-2">Upload CSV or GeoJSON datasets.</p>
        <input
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onUpload(f)
          }}
        />
        <div className="text-sm mt-2">{status}</div>
      </div>
    </main>
  )
}
