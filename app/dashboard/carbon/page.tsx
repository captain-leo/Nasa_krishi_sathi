import { CarbonCalculator } from "@/components/carbon/calculator"
import { CarbonTransactionsTable } from "@/components/carbon/transactions-table"

export default function CarbonDashboardPage() {
  return (
    <main className="container mx-auto max-w-6xl py-6 space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-pretty">Carbon Credits</h1>
        <p className="text-sm text-muted-foreground">
          Estimate credits by land size or GeoJSON, then record farmer or industry transactions with price ranges.
        </p>
      </section>

      <CarbonCalculator />

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Recent Transactions</h2>
        <CarbonTransactionsTable />
      </section>
    </main>
  )
}
