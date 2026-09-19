import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Sliders,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Calendar,
  Clock,
  Leaf,
  AlertCircle,
  Lightbulb,
} from "lucide-react"
import PageContainer from "@/components/layout/PageContainer"
import SectionHeader from "@/components/layout/SectionHeader"
import ScenarioTable from "@/components/simulator/ScenarioTable"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/lib/AppContext"
import { estimateCateringPlan } from "@/services/api"
import { calculateScenarioDelta } from "@/lib/simulatorUtils"
import { cn } from "@/lib/utils"

export default function WhatIfSimulator({ onNavigate }) {
  const {
    eventData,
    selectedMenu,
    resetEventData,
    clearMenu,
    planResult: sharedPlanResult,
    setPlanResult: setSharedPlanResult,
  } = useAppContext()

  const [planResult, setPlanResult] = React.useState(sharedPlanResult)

  const originalGuests = Math.max(1, parseInt(eventData?.guests, 10) || 500)
  const [simulatedGuests, setSimulatedGuests] = React.useState(originalGuests)

  // Reset simulated guests if eventData.guests changes
  React.useEffect(() => {
    setSimulatedGuests(originalGuests)
  }, [originalGuests])

  // Sync with shared plan result if updated
  React.useEffect(() => {
    if (sharedPlanResult) {
      setPlanResult(sharedPlanResult)
    }
  }, [sharedPlanResult])

  // Empty state detection
  const hasEventData = Boolean(
    eventData && (eventData.eventType || eventData.guests > 0)
  )
  const hasSelectedDishes = Boolean(selectedMenu && selectedMenu.length > 0)

  // Load baseline estimate if not already available
  React.useEffect(() => {
    if (hasEventData && hasSelectedDishes && !planResult && !sharedPlanResult) {
      let isMounted = true
      estimateCateringPlan(eventData, selectedMenu).then((res) => {
        if (isMounted) {
          setPlanResult(res)
          setSharedPlanResult(res)
        }
      })
      return () => {
        isMounted = false
      }
    }
  }, [eventData, selectedMenu, hasEventData, hasSelectedDishes, planResult, sharedPlanResult, setSharedPlanResult])

  const { diff, pct, formattedPct, formattedDiff } = calculateScenarioDelta(
    simulatedGuests,
    originalGuests
  )

  // Slider change handler
  const handleSliderChange = (vals) => {
    if (Array.isArray(vals) && vals.length > 0) {
      setSimulatedGuests(vals[0])
    }
  }

  // Direct numeric input change handler
  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val)) {
      setSimulatedGuests(Math.min(1500, Math.max(100, val)))
    }
  }

  // Quick preset shortcuts
  const handleSetGuests = (count) => {
    setSimulatedGuests(Math.min(1500, Math.max(100, count)))
  }

  const handleResetToBaseline = () => {
    setSimulatedGuests(originalGuests)
  }

  const handleNewPlan = () => {
    resetEventData()
    clearMenu()
    if (onNavigate) {
      onNavigate("/event")
    }
  }

  /* ─────────────────────────────────────────────
     1. EMPTY STATE: Event details missing
  ───────────────────────────────────────────── */
  if (!hasEventData) {
    return (
      <PageContainer maxWidth="lg" className="py-12">
        <Card className="border border-border/80 bg-card shadow-sm p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              Your event details are missing
            </h2>
            <p className="text-sm text-muted-foreground">
              Please enter your guest count and event details before using the simulator.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => onNavigate && onNavigate("/event")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            Start Event Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </PageContainer>
    )
  }

  /* ─────────────────────────────────────────────
     2. EMPTY STATE: Menu selection missing
  ───────────────────────────────────────────── */
  if (!hasSelectedDishes) {
    return (
      <PageContainer maxWidth="lg" className="py-12">
        <Card className="border border-border/80 bg-card shadow-sm p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              Generate a catering plan before using the simulator
            </h2>
            <p className="text-sm text-muted-foreground">
              Select dishes and generate an initial catering plan first to establish a production baseline.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => onNavigate && onNavigate("/menu")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            Choose Menu
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </PageContainer>
    )
  }

  /* ─────────────────────────────────────────────
     3. SIMULATOR EXPERIENCE
  ───────────────────────────────────────────── */
  const eventTypeName = eventData?.eventType
    ? eventData.eventType.charAt(0).toUpperCase() + eventData.eventType.slice(1)
    : "Wedding"

  const mealTimeName = eventData?.mealTime
    ? eventData.mealTime.charAt(0).toUpperCase() + eventData.mealTime.slice(1)
    : "Dinner"

  const seasonName = eventData?.season
    ? eventData.season.charAt(0).toUpperCase() + eventData.season.slice(1)
    : "Winter"

  return (
    <PageContainer maxWidth="xl" className="pb-24">
      {/* ── HEADER NAVIGATION ── */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onNavigate && onNavigate("/results")}
          className="text-xs text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Catering Plan
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleNewPlan}
          className="text-xs text-muted-foreground hover:text-foreground h-8"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Start New Plan
        </Button>
      </div>

      {/* ── PAGE TITLE ── */}
      <div className="mt-6">
        <SectionHeader
          eyebrow="SIMULATION"
          title="What-If Simulator"
          description="Adjust attendance or event factors to see how your catering plan changes."
          className="text-left"
        />
      </div>

      {/* ── EVENT CONTEXT COMPACT CARD ── */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/80 p-3.5 sm:px-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Baseline Plan
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {eventData?.vegetarianPct || 70}% Veg / {eventData?.nonVegetarianPct || 30}% Non-Veg
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {eventTypeName} · {seasonName} · {mealTimeName} · {originalGuests} guests · {eventData?.duration || 4} hours
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-xs font-semibold bg-secondary/60">
          Baseline: {originalGuests} guests
        </Badge>
      </div>

      {/* ── MAIN INTERACTIVE SLIDER CONTROL CARD ── */}
      <Card className="mt-8 border border-border/80 bg-card shadow-sm">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Adjust Guest Count
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Drag the slider or type an exact headcount to test alternate turnout scenarios.
              </p>
            </div>

            {/* Direct numeric input */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="relative flex items-center">
                <Input
                  type="number"
                  min={100}
                  max={1500}
                  step={10}
                  value={simulatedGuests}
                  onChange={handleInputChange}
                  className="h-10 w-28 text-center font-bold text-base border-primary/40 focus-visible:ring-primary"
                  aria-label="Simulated guest headcount"
                />
                <span className="ml-2 text-xs font-semibold text-muted-foreground">
                  guests
                </span>
              </div>

              {simulatedGuests !== originalGuests && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetToBaseline}
                  className="h-10 px-2.5 text-xs text-muted-foreground hover:text-primary"
                  title="Reset to baseline guests"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4 pt-2">
            <Slider
              value={[simulatedGuests]}
              min={100}
              max={1500}
              step={10}
              onValueChange={handleSliderChange}
              className="py-2"
              aria-label="Simulated guest count slider"
            />

            {/* Range markers */}
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>100 min</span>
              <span className="font-semibold text-foreground/80">
                Baseline: {originalGuests}
              </span>
              <span>1500 max</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground mr-1">Quick Scenarios:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSetGuests(400)}
              className={cn(
                "h-7 px-2 text-xs",
                simulatedGuests === 400 && "border-primary bg-primary/10 text-primary font-bold"
              )}
            >
              400 (-20%)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSetGuests(originalGuests)}
              className={cn(
                "h-7 px-2 text-xs",
                simulatedGuests === originalGuests && "border-primary bg-primary/10 text-primary font-bold"
              )}
            >
              Baseline ({originalGuests})
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSetGuests(650)}
              className={cn(
                "h-7 px-2 text-xs",
                simulatedGuests === 650 && "border-primary bg-primary/10 text-primary font-bold"
              )}
            >
              650 (+30%)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSetGuests(800)}
              className={cn(
                "h-7 px-2 text-xs",
                simulatedGuests === 800 && "border-primary bg-primary/10 text-primary font-bold"
              )}
            >
              800 guests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── COMPARISON SUMMARY CARDS ── */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current Plan */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Plan
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {originalGuests} guests
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Original baseline from Event Setup
          </p>
        </div>

        {/* New Scenario */}
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 shadow-xs ring-1 ring-primary/20">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            New Scenario
          </div>
          <motion.div
            key={simulatedGuests}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            className="mt-1 text-2xl font-bold tracking-tight text-primary"
          >
            {simulatedGuests} guests
          </motion.div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {diff === 0 ? "Identical to original" : `${formattedDiff} guests vs baseline`}
          </p>
        </div>

        {/* Estimated Production Change */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Production Variance
          </div>
          <motion.div
            key={formattedPct}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "mt-1 text-2xl font-bold tracking-tight flex items-center gap-1.5",
              pct > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : pct < 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-foreground"
            )}
          >
            {pct > 0 && <TrendingUp className="h-6 w-6 stroke-[2.5]" />}
            {pct < 0 && <TrendingDown className="h-6 w-6 stroke-[2.5]" />}
            {pct === 0 && <Minus className="h-6 w-6" />}
            {formattedPct}
          </motion.div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {pct > 0
              ? "Proportional production expansion"
              : pct < 0
                ? "Proportional reduction in batch prep"
                : "Exact baseline production"}
          </p>
        </div>
      </div>

      {/* ── SCENARIO COMPARISON TABLE ── */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Dish-Level Comparison
          </h3>
          <span className="text-xs text-muted-foreground">
            Calculated dynamically from baseline without modifying stored plan
          </span>
        </div>

        <ScenarioTable
          estimates={planResult?.estimates || []}
          originalGuests={originalGuests}
          simulatedGuests={simulatedGuests}
          formattedPct={formattedPct}
          pct={pct}
        />
      </div>

      {/* ── SCENARIO INSIGHT CARD ── */}
      <div className="mt-8">
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-5 sm:p-6 space-y-2.5">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-base text-foreground">
                Scenario insight
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
              {diff > 0
                ? `With ${diff} additional guests (+${pct}%), recommended production quantities scale proportionally from your ${originalGuests}-guest baseline to maintain target portion security without kitchen bottlenecks.`
                : diff < 0
                  ? `With fewer expected guests (${Math.abs(diff)} fewer, ${pct}%), this scenario reduces recommended production proportionally while preserving the exact same balanced menu mix and preventing food waste.`
                  : `Simulated attendance matches your original ${originalGuests}-guest plan. Recommended quantities align exactly with your baseline culinary forecast.`}
            </p>

            <p className="text-[11px] text-muted-foreground">
              *Calculated in real-time. Original Catering Plan in Results Dashboard remains safely preserved at {originalGuests} guests.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── BOTTOM ACTIONS ── */}
      <div className="mt-12 pt-6 border-t border-border/80">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate && onNavigate("/results")}
            className="border-border text-foreground hover:bg-secondary h-11 px-5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catering Plan
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleNewPlan}
            className="border-border text-foreground hover:bg-secondary h-11 px-5"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Start New Plan
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
