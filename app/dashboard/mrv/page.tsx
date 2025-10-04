import MRVMap from "@/components/mrv-map"

export default function Page() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-semibold text-pretty">Monitoring, Reporting & Verification (MRV)</h1>
      <MRVMap />
      <p className="mt-4 text-sm text-muted-foreground">
        Draw your field boundary to measure area. You can use the NASA imagery API (via our proxy) on other pages to
        retrieve satellite snapshots for the given coordinates and dates.
      </p>
    </main>
  )
}
