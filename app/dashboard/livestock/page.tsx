import LivestockManager from "@/components/livestock/livestock-manager"

export default function Page() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-semibold text-pretty">Livestock</h1>
      <LivestockManager />
    </main>
  )
}
