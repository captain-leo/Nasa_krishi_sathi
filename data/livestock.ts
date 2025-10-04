export type LivestockItem = {
  type: string
  dailyFeedKg: number
  waterLiters: number
  notes?: string
}

export const LIVESTOCK_DEFAULTS: LivestockItem[] = [
  { type: "Cow (dairy)", dailyFeedKg: 25, waterLiters: 60, notes: "High-yield dairy requires steady water" },
  { type: "Buffalo", dailyFeedKg: 28, waterLiters: 65 },
  { type: "Goat", dailyFeedKg: 4, waterLiters: 6, notes: "Browse preference; drought tolerant" },
  { type: "Sheep", dailyFeedKg: 3.5, waterLiters: 5 },
  { type: "Chicken", dailyFeedKg: 0.13, waterLiters: 0.35, notes: "Per bird; layer feed schedule" },
]
