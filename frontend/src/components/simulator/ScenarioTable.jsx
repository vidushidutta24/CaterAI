import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
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
import { calculateScenarioQuantity } from "@/lib/simulatorUtils"
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

export default function ScenarioTable({
  estimates = [],
  originalGuests = 500,
  simulatedGuests = 500,
  formattedPct = "0%",
  pct = 0,
}) {
  if (!estimates || estimates.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-8 text-center text-muted-foreground">
        No dishes available in current catering plan.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow className="hover:bg-transparent border-b border-border/70">
            <TableHead className="w-[220px] sm:w-[260px] font-bold text-foreground py-3.5 pl-4">
              Dish
            </TableHead>
            <TableHead className="font-bold text-foreground py-3.5">
              Current Plan ({originalGuests} guests)
            </TableHead>
            <TableHead className="font-bold text-foreground py-3.5">
              New Estimate ({simulatedGuests} guests)
            </TableHead>
            <TableHead className="font-bold text-foreground py-3.5 pr-4 text-right sm:text-left">
              Change
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {estimates.map((item, index) => {
            const IconComp = ICON_MAP[item.icon] || UtensilsCrossed
            const currentQty = item.recommendedQuantity
            const newQty = calculateScenarioQuantity(
              currentQty,
              simulatedGuests,
              originalGuests
            )

            return (
              <TableRow
                key={item.dishId || index}
                className="hover:bg-secondary/30 transition-colors border-b border-border/50"
              >
                {/* Dish Cell */}
                <TableCell className="py-3.5 pl-4">
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

                {/* Current Plan Baseline */}
                <TableCell className="py-3.5 whitespace-nowrap text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/80 bg-secondary/80 px-2.5 py-1 rounded-md">
                    {currentQty}
                  </span>
                </TableCell>

                {/* New Estimate (Calculated, Motion animated) */}
                <TableCell className="py-3.5 whitespace-nowrap">
                  <motion.div
                    key={`${item.dishId}-${newQty}`}
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="inline-block"
                  >
                    <span className="text-base font-bold tracking-tight text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-md">
                      {newQty}
                    </span>
                  </motion.div>
                </TableCell>

                {/* Change Badge */}
                <TableCell className="py-3.5 pr-4 whitespace-nowrap text-right sm:text-left">
                  <motion.div
                    key={`${item.dishId}-${pct}`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.12 }}
                    className="inline-block"
                  >
                    {pct > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <TrendingUp className="h-3 w-3 stroke-[2.5]" />
                        {formattedPct}
                      </span>
                    ) : pct < 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <TrendingDown className="h-3 w-3 stroke-[2.5]" />
                        {formattedPct}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        <Minus className="h-3 w-3" />
                        0%
                      </span>
                    )}
                  </motion.div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
