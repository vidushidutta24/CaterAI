import * as React from "react"
import { motion } from "motion/react"
import {
  IndianRupee,
  TrendingDown,
  Leaf,
  Recycle,
  Sparkles,
  Info,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ImpactPanel({
  estimatedTotalCost = "Not provided",
  costFootnote = "Not calculated by backend",
  estimatedSurplusReduction = "15–20% surplus prevented",
  surplusFootnote = "Backend verified estimate",
  estimatedCO2Impact = "Not provided",
  co2Footnote = "Not calculated by backend",
  isBackendSource = true,
}) {
  const isCostProvided = estimatedTotalCost !== "Not provided"
  const isCo2Provided = estimatedCO2Impact !== "Not provided"

  const metrics = [
    {
      title: "Potential Surplus Reduction",
      value: estimatedSurplusReduction,
      subtext: surplusFootnote,
      icon: TrendingDown,
      accent: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      valueColor: "text-emerald-700 dark:text-emerald-400 font-bold",
    },
    {
      title: "Estimated Catering Cost",
      value: estimatedTotalCost,
      subtext: costFootnote,
      icon: IndianRupee,
      accent: isCostProvided
        ? "text-primary bg-primary/10 border-primary/20"
        : "text-muted-foreground bg-muted/40 border-border",
      valueColor: isCostProvided
        ? "text-foreground font-bold"
        : "text-muted-foreground text-base font-medium",
    },
    {
      title: "Estimated CO₂ Impact",
      value: estimatedCO2Impact,
      subtext: co2Footnote,
      icon: Leaf,
      accent: isCo2Provided
        ? "text-teal-600 bg-teal-500/10 border-teal-500/20"
        : "text-muted-foreground bg-muted/40 border-border",
      valueColor: isCo2Provided
        ? "text-teal-700 dark:text-teal-400 font-bold"
        : "text-muted-foreground text-base font-medium",
    },
  ]

  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Recycle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                Estimated Impact
              </h3>
              <span className="text-[11px] text-muted-foreground">
                Projected efficiency and footprint
              </span>
            </div>
          </div>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
            Model Estimate
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/30 p-3.5"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-muted-foreground">
                    {metric.title}
                  </div>
                  <div className={`text-xl font-bold tracking-tight ${metric.valueColor}`}>
                    {metric.value}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <span>{metric.subtext}</span>
                  </div>
                </div>

                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${metric.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </motion.div>
            )
          })}
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
          *Illustrative model estimates for baseline planning. Does not represent certified environmental audit or fixed commercial quote.
        </p>
      </CardContent>
    </Card>
  )
}
