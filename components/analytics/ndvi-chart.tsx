"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface NDVIChartProps {
  data: any[]
  crops: any[]
}

export function NDVIChart({ data, crops }: NDVIChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No monitoring data available. Start collecting data to see trends.
      </div>
    )
  }

  // Group data by date
  const groupedData = data.reduce(
    (acc, item) => {
      const date = item.monitoring_date
      if (!acc[date]) {
        acc[date] = { date }
      }
      const crop = crops.find((c) => c.id === item.farm_crop_id)
      if (crop) {
        acc[date][crop.crop_types?.name || "Unknown"] = item.ndvi_value
      }
      return acc
    },
    {} as Record<string, any>,
  )

  const chartData = Object.values(groupedData).sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const colors = ["#16a34a", "#2563eb", "#dc2626", "#ca8a04", "#9333ea"]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
        />
        <YAxis domain={[0, 1]} label={{ value: "NDVI", angle: -90, position: "insideLeft" }} />
        <Tooltip
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: any) => value?.toFixed(3)}
        />
        <Legend />
        {crops.map((crop, index) => (
          <Line
            key={crop.id}
            type="monotone"
            dataKey={crop.crop_types?.name}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
