import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sparkles, Check, Brain, ChefHat, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const STAGES = [
  { id: 1, label: "Analyzing guest profile...", completedText: "Guest profile analyzed" },
  { id: 2, label: "Analyzing dietary mix...", completedText: "Dietary mix analyzed" },
  { id: 3, label: "Analyzing selected menu...", completedText: "Menu composition analyzed" },
  { id: 4, label: "Generating quantity recommendations...", completedText: "Dish quantities calculated" },
  { id: 5, label: "Preparing your catering plan...", completedText: "Catering plan finalized" },
]

export default function AIAnalysisLoader({ onComplete, duration = 2600 }) {
  const [currentStage, setCurrentStage] = React.useState(0)
  const [progress, setProgress] = React.useState(15)

  React.useEffect(() => {
    // Deterministic stage intervals across ~2.5s
    const stageInterval = duration / STAGES.length // ~520ms per stage

    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        const next = prev + 1
        setProgress(Math.min(100, Math.round(((next + 1) / STAGES.length) * 100)))
        if (next >= STAGES.length) {
          clearInterval(timer)
          setTimeout(() => {
            onComplete && onComplete()
          }, 350)
          return STAGES.length - 1
        }
        return next
      })
    }, stageInterval)

    return () => clearInterval(timer)
  }, [duration, onComplete])

  return (
    <div className="flex min-h-[580px] w-full items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Card className="relative overflow-hidden border border-border/80 bg-card shadow-xl shadow-primary/5">
          {/* Subtle top accent gradient */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/40" />

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Top header badge */}
            <div className="flex flex-col items-center text-center space-y-3">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs ring-4 ring-primary/10"
              >
                <Sparkles className="h-7 w-7" />
              </motion.div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-primary">
                  <Brain className="h-3.5 w-3.5" />
                  CaterAI Intelligence
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Preparing your plan...
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Evaluating guest consumption models and menu portion algorithms
                </p>
              </div>
            </div>

            {/* Smooth progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Model estimation</span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-secondary" />
            </div>

            {/* Staged transitions checklist */}
            <div className="space-y-3 rounded-xl border border-border/60 bg-secondary/30 p-4">
              {STAGES.map((stage, index) => {
                const isCompleted = index < currentStage
                const isCurrent = index === currentStage
                const isUpcoming = index > currentStage

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={cn(
                      "flex items-center gap-3 text-xs sm:text-sm transition-colors duration-200",
                      isCompleted && "text-foreground font-medium",
                      isCurrent && "text-primary font-semibold",
                      isUpcoming && "text-muted-foreground/60"
                    )}
                  >
                    {/* Icon status indicator */}
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {isCompleted ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      ) : isCurrent ? (
                        <div className="flex h-5 w-5 items-center justify-center text-primary">
                          <Loader2 className="h-4 w-4 animate-spin stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="h-2 w-2 rounded-full border border-border bg-card" />
                      )}
                    </div>

                    {/* Stage text */}
                    <span className="flex-1">
                      {isCompleted ? stage.completedText : stage.label}
                    </span>

                    {/* Completed tag */}
                    {isCompleted && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Done
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ChefHat className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Calibrated for live event delivery & zero kitchen waste</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
