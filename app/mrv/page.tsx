import MRVMap from "@/components/mrv-map"

export default function Page() {
  return (
    <main className="container mx-auto p-4">
      <MRVMap />
      <div className="mt-6 text-sm text-muted-foreground">
        Tip: Toggle NDVI/Rainfall/Soil layers to explore NASA data. Draw a polygon to measure land and run analysis.
      </div>
    </main>
  )
}
