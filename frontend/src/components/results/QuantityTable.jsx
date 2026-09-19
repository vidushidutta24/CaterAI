import * as React from "react"
import { motion } from "motion/react"
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Flame,
  Salad,
  Drumstick,
  Leaf,
  UtensilsCrossed,
  Soup,
  Sparkles,
  Wheat,
  CircleDot,
  Cake,
  IceCreamBowl,
  Milk,
  CupSoda,
  Citrus,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const ICON_MAP = {
  Flame,
  Salad,
  Drumstick,
  Leaf,
  UtensilsCrossed,
  Soup,
  Sparkles,
  Wheat,
  CircleDot,
  Cake,
  IceCreamBowl,
  Milk,
  CupSoda,
  Citrus,
}

function ConfidenceBadge({ confidence }) {
  let pct = 85
  let displayText = "85%"

  if (typeof confidence === "number") {
    pct = confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence)
    displayText = `${pct}%`
  } else if (typeof confidence === "string") {
    if (confidence.endsWith("%")) {
      pct = parseInt(confidence, 10) || 85
      displayText = confidence
    } else if (confidence.toLowerCase() === "high") {
      pct = 85
      displayText = "85%"
    } else if (confidence.toLowerCase() === "medium") {
      pct = 65
      displayText = "65%"
    } else {
      const parsed = parseFloat(confidence)
      if (!isNaN(parsed)) {
        pct = parsed <= 1 ? Math.round(parsed * 100) : Math.round(parsed)
        displayText = `${pct}%`
      } else {
        displayText = confidence
      }
    }
  }

  if (pct >= 75) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
        {displayText}
      </span>
    )
  }

  if (pct >= 50) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
        <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
        {displayText}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-muted bg-muted/60 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
      <Info className="h-3 w-3" />
      {displayText}
    </span>
  )
}

export default function QuantityTable({ estimates = [] }) {
  if (!estimates || estimates.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-8 text-center text-muted-foreground">
        No dishes selected for estimation.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent border-b border-border/70">
              <TableHead className="w-[200px] sm:w-[240px] font-bold text-foreground py-3.5 pl-4">
                Dish
              </TableHead>
              <TableHead className="font-bold text-foreground py-3.5">
                Expected Consumers
              </TableHead>
              <TableHead className="font-bold text-foreground py-3.5">
                Recommended Quantity
              </TableHead>
              <TableHead className="font-bold text-foreground py-3.5">
                Confidence
              </TableHead>
              <TableHead className="font-bold text-foreground py-3.5 pr-4">
                Reason
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {estimates.map((item, index) => {
              const IconComp = ICON_MAP[item.icon] || UtensilsCrossed

              return (
                <TableRow
                  key={item.dishId || index}
                  className="hover:bg-secondary/30 transition-colors border-b border-border/50"
                >
                  {/* Dish Cell with small visual badge */}
                  <TableCell className="py-3.5 pl-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/15">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm leading-tight">
                          {item.dishName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-muted-foreground">
                            {item.category}
                          </span>
                          {item.dietary && (
                            <>
                              <span className="text-[10px] text-border">•</span>
                              <span
                                className={cn(
                                  "text-[10px] font-medium",
                                  item.dietary === "veg"
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-rose-600 dark:text-rose-400"
                                )}
                              >
                                {item.dietary === "veg" ? "Veg" : "Non-Veg"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Expected Consumers */}
                  <TableCell className="py-3.5 text-sm text-foreground/85 whitespace-nowrap">
                    <span className="font-medium">{item.expectedConsumers}</span>
                  </TableCell>

                  {/* Recommended Quantity (visually prominent) */}
                  <TableCell className="py-3.5 whitespace-nowrap">
                    <span className="text-base font-bold tracking-tight text-foreground bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
                      {item.recommendedQuantity}
                    </span>
                  </TableCell>

                  {/* Confidence Badge */}
                  <TableCell className="py-3.5 whitespace-nowrap">
                    <ConfidenceBadge confidence={item.confidence} />
                  </TableCell>

                  {/* Reason */}
                  <TableCell className="py-3.5 text-xs text-muted-foreground pr-4 max-w-[280px]">
                    <p className="line-clamp-2 leading-relaxed">{item.reason}</p>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Model disclaimer note */}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
        <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span>
          AI-generated estimates based on event inputs and selected menu. Actual consumption may vary.
        </span>
      </p>
    </div>
  )
}
