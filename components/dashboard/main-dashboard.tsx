"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type DataResponse = {
  ok: boolean
  data?: {
    source: string
    lat: number
    lon: number
    latest?: {
      date: string
      t2m: number | null
      rh2m: number | null
      prectot: number | null
      ws10m: number | null
    } | null
    indicators?: {
      avgT2M: number | null
      totalRain: number | null
    }
  }
  error?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MainDashboard() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setDenied(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude, lon: longitude })
      },
      () => {
        setDenied(true)
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    )
  }, [])

  const { data, isLoading, error, mutate } = useSWR<DataResponse>(
    coords ? `/api/nasa/data?lat=${coords.lat}&lon=${coords.lon}` : null,
    fetcher,
  )

  const fallbackLoc = { lat: 28.6139, lon: 77.209 } // New Delhi fallback if denied

  const activeLat = coords?.lat ?? fallbackLoc.lat
  const activeLon = coords?.lon ?? fallbackLoc.lon

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-pretty">Live Location</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm">
            <div>Latitude: {activeLat.toFixed(4)}</div>
            <div>Longitude: {activeLon.toFixed(4)}</div>
            {denied && (
              <div className="mt-2 text-xs text-muted-foreground">
                Location access denied; using a default location.
              </div>
            )}
          </div>
          <Button variant="outline" onClick={() => mutate()} aria-label="Refresh data">
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-pretty">Weather Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-muted-foreground">Loading latest weather…</div>}
          {error && <div className="text-destructive">Failed to load data.</div>}
          {!isLoading && data?.ok && data?.data?.latest ? (
            <div className="grid gap-1 text-sm">
              <div>Date: {data.data.latest.date}</div>
              <div>Temp (°C): {data.data.latest.t2m ?? "—"}</div>
              <div>Humidity (%): {data.data.latest.rh2m ?? "—"}</div>
              <div>Rain (mm): {data.data.latest.prectot ?? "—"}</div>
              <div>Wind 10m (m/s): {data.data.latest.ws10m ?? "—"}</div>
            </div>
          ) : (
            !isLoading && <div className="text-muted-foreground">No data available.</div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-pretty">Highlights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          <div className="text-sm">
            <div className="font-medium">Average Temp (7d)</div>
            <div>{data?.data?.indicators?.avgT2M ?? "—"} °C</div>
          </div>
          <div className="text-sm">
            <div className="font-medium">Total Rain (7d)</div>
            <div>{data?.data?.indicators?.totalRain ?? "—"} mm</div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
