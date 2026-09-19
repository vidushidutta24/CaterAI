import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Info } from "lucide-react"

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-border bg-popover/95 p-3 shadow-md backdrop-blur-sm text-xs space-y-1">
        <p className="font-bold text-popover-foreground">{data.dishName}</p>
        <p className="text-muted-foreground">Category: <span className="font-medium text-foreground">{data.category}</span></p>
        <p className="text-muted-foreground">Recommended: <span className="font-bold text-primary">{data.recommendedQuantity}</span></p>
        <p className="text-muted-foreground">Relative Demand Index: <span className="font-semibold text-foreground">{data.relativeScore}/100</span></p>
      </div>
    )
  }
  return null
}

export default function QuantityChart({ estimates = [] }) {
  // Sort top dishes by demand/relative score for optimal scanning
  const chartData = React.useMemo(() => {
    return estimates.slice(0, 8).map((d) => ({
      dishName: d.dishName,
      relativeScore: d.relativeScore || 70,
      recommendedQuantity: d.recommendedQuantity,
      category: d.category,
    }))
  }, [estimates])

  if (!chartData || chartData.length === 0) return null

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                Recommended Production
              </h3>
              <span className="text-xs text-muted-foreground">
                Relative production demand index (0–100 scale)
              </span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground self-start sm:self-auto">
            Normalized across diverse units (kg, pcs, litres)
          </span>
        </div>

        {/* Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="dishName"
                width={105}
                tick={{ fontSize: 11, fill: "var(--color-foreground)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-secondary)", opacity: 0.5 }} />
              <Bar
                dataKey="relativeScore"
                radius={[0, 6, 6, 0]}
                fill="var(--color-primary)"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.relativeScore > 85
                        ? "var(--color-primary)"
                        : "var(--color-primary)"
                    }
                    opacity={0.85 + (index % 3) * 0.05}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-t border-border/50 pt-2.5">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>
            Production index visualizes portion-intensity relative to overall event attendance.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
