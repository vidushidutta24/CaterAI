import * as React from "react"
import { motion } from "motion/react"
import { Sparkles, Check, Brain, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AIExplanation({ explanationIntro, reasoningPoints = [] }) {
  return (
    <Card className="border border-border/80 bg-card shadow-xs">
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">
              Why these quantities?
            </h3>
            <span className="text-xs text-muted-foreground">
              Contextual rationale derived from your event profile
            </span>
          </div>
        </div>

        {/* Introduction text */}
        <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
          {explanationIntro ||
            "CaterAI considers your guest scale, adult/child ratio, vegetarian mix, meal timing, duration, and menu synergy when generating these estimates."}
        </p>

        {/* Reasoning Points */}
        <div className="space-y-2.5 pt-1">
          {reasoningPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-start gap-2.5 rounded-lg border border-border/40 bg-secondary/30 p-2.5 text-xs sm:text-sm text-foreground/90"
            >
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span className="leading-snug">{point}</span>
            </motion.div>
          ))}
        </div>

        {/* Verification note */}
        <div className="flex items-center gap-2 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>Calculated using CaterAI culinary portion heuristics</span>
        </div>
      </CardContent>
    </Card>
  )
}
