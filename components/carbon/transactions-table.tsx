"use client"

import useSWR from "swr"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function CarbonTransactionsTable() {
  const { data, error, isLoading, mutate } = useSWR("/api/carbon/transactions", fetcher)

  useEffect(() => {
    const handler = () => mutate()
    window.addEventListener("carbon-tx-refresh", handler as any)
    return () => window.removeEventListener("carbon-tx-refresh", handler as any)
  }, [mutate])

  if (error) {
    return <Card className="p-4">Failed to load transactions.</Card>
  }
  if (isLoading) {
    return <Card className="p-4">Loading transactions…</Card>
  }

  const rows = data?.transactions ?? []
  return (
    <Card className="p-0 overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Side</th>
            <th className="text-left p-2">Crop</th>
            <th className="text-right p-2">Area (ha)</th>
            <th className="text-right p-2">Credits</th>
            <th className="text-right p-2">Unit Price</th>
            <th className="text-right p-2">Total Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
              <td className="p-2 capitalize">{r.side}</td>
              <td className="p-2 capitalize">{r.crop_type}</td>
              <td className="p-2 text-right">{Number(r.area_ha).toFixed(3)}</td>
              <td className="p-2 text-right">{Number(r.credits).toFixed(3)}</td>
              <td className="p-2 text-right">${Number(r.unit_price).toFixed(2)}</td>
              <td className="p-2 text-right">${Number(r.total_value).toFixed(2)}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={7}>
                No transactions yet. Create one from the calculator above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  )
}
