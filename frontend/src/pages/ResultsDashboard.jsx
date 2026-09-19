import * as React from "react"
import { motion } from "motion/react"
import {
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Leaf,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Printer,
  RotateCcw,
  Sliders,
  AlertCircle,
  Utensils,
  Flame,
  UtensilsCrossed,
  Wheat,
  Cake,
  CupSoda,
  ShieldCheck,
  Info,
  SunMedium,
} from "lucide-react"
import PageContainer from "@/components/layout/PageContainer"
import StepIndicator from "@/components/layout/StepIndicator"
import AIAnalysisLoader from "@/components/results/AIAnalysisLoader"
import QuantityTable from "@/components/results/QuantityTable"
import ImpactPanel from "@/components/results/ImpactPanel"
import AIExplanation from "@/components/results/AIExplanation"
import QuantityChart from "@/components/results/QuantityChart"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/lib/AppContext"
import {
  estimateCateringPlan,
  getDemoCateringPlan,
} from "@/services/api"
import { MENU_CATEGORIES } from "@/data/menu"
import { cn } from "@/lib/utils"

const CATEGORY_ICONS = {
  Starters: Flame,
  "Main Course": UtensilsCrossed,
  Bread: Wheat,
  Desserts: Cake,
  Drinks: CupSoda,
}

export default function ResultsDashboard({ onNavigate }) {
  const {
    eventData,
    selectedMenu,
    resetEventData,
    clearMenu,
    planResult,
    setPlanResult,
  } = useAppContext()

  // Track loading and error states
  const [isLoading, setIsLoading] = React.useState(!planResult)
  const [apiError, setApiError] = React.useState(null)

  // Empty state detection
  const hasEventData = Boolean(
    eventData && (eventData.eventType || eventData.guests > 0)
  )
  const hasSelectedDishes = Boolean(selectedMenu && selectedMenu.length > 0)

  // Function to fetch plan from real backend
  const fetchRealPlan = React.useCallback(async () => {
    if (!hasEventData || !hasSelectedDishes) return
    setApiError(null)
    setIsLoading(true)

    try {
      const result = await estimateCateringPlan(eventData, selectedMenu)
      setPlanResult(result)
    } catch (err) {
      console.error("[ResultsDashboard] Backend Error:", err)
      setApiError(err.message || "Failed to reach CaterAI backend server.")
    }
  }, [hasEventData, hasSelectedDishes, eventData, selectedMenu, setPlanResult])

  // Initial load
  React.useEffect(() => {
    if (hasEventData && hasSelectedDishes && !planResult) {
      fetchRealPlan()
    } else if (planResult) {
      setIsLoading(false)
    }
  }, [hasEventData, hasSelectedDishes, planResult, fetchRealPlan])

  // Fallback to demo data on user demand
  const handleUseDemoData = () => {
    const demo = getDemoCateringPlan(eventData, selectedMenu)
    setPlanResult(demo)
    setApiError(null)
    setIsLoading(false)
  }

  // Handle "New Plan" action
  const handleNewPlan = () => {
    resetEventData()
    clearMenu()
    if (onNavigate) {
      onNavigate("/event")
    }
  }

  // Handle "Download / Print Plan"
  const handlePrintPlan = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  // Calculate category summary quantities / counts
  const categorySummaries = React.useMemo(() => {
    if (!planResult?.estimates) return []

    return MENU_CATEGORIES.map((category) => {
      const categoryDishes = planResult.estimates.filter(
        (e) => e.category === category
      )

      if (categoryDishes.length === 0) return null

      // If category has a unified unit (e.g. Bread all pieces, Drinks all litres)
      let summaryText = `${categoryDishes.length} ${categoryDishes.length === 1 ? "dish" : "dishes"
        }`

      if (category === "Bread") {
        const totalPcs = categoryDishes.reduce((sum, d) => {
          const num = parseInt(d.recommendedQuantity, 10) || 0
          return sum + num
        }, 0)
        if (totalPcs > 0) summaryText = `${totalPcs} pcs`
      } else if (category === "Drinks") {
        const totalLitres = categoryDishes.reduce((sum, d) => {
          const num = parseFloat(d.recommendedQuantity) || 0
          return sum + num
        }, 0)
        if (totalLitres > 0) {
          const rounded = Math.round(totalLitres * 10) / 10
          summaryText = `${rounded} L`
        }
      }

      return {
        category,
        count: categoryDishes.length,
        summaryText,
        Icon: CATEGORY_ICONS[category] || Utensils,
      }
    }).filter(Boolean)
  }, [planResult])

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
              Please enter your guest count and event details to generate an accurate catering plan.
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
            <Utensils className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              Select at least one dish to generate a plan
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose the items you plan to serve at your event so our AI can calculate recommended quantities.
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
     3. ERROR STATE: Backend connection failure
  ───────────────────────────────────────────── */
  if (apiError && !planResult) {
    return (
      <PageContainer maxWidth="lg" className="py-12">
        <Card className="border border-destructive/30 bg-destructive/5 shadow-sm p-8 text-center space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-foreground">
              Unable to generate your catering plan
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {apiError}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              onClick={fetchRealPlan}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleUseDemoData}
              className="border-border text-foreground hover:bg-secondary"
            >
              Use Demo Data
            </Button>
          </div>
        </Card>
      </PageContainer>
    )
  }

  /* ─────────────────────────────────────────────
     4. AI GENERATION LOADING EXPERIENCE
  ───────────────────────────────────────────── */
  if (isLoading) {
    return (
      <PageContainer maxWidth="xl">
        <div className="no-print">
          <StepIndicator
            currentStep={3}
            onStepClick={(s) => {
              if (s === 1 && onNavigate) onNavigate("/event")
              if (s === 2 && onNavigate) onNavigate("/menu")
            }}
          />
        </div>
        <AIAnalysisLoader onComplete={() => setIsLoading(false)} />
      </PageContainer>
    )
  }

  /* ─────────────────────────────────────────────
     5. FULL RESULTS DASHBOARD
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
      {/* ── STEP INDICATOR ── */}
      <div className="no-print">
        <StepIndicator
          currentStep={3}
          onStepClick={(s) => {
            if (s === 1 && onNavigate) onNavigate("/event")
            if (s === 2 && onNavigate) onNavigate("/menu")
            if (s === 3 && onNavigate) onNavigate("/results")
          }}
        />
      </div>

      {/* ── TOP ACTION BAR ── */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4 no-print">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Plan Reference:
          </span>
          <Badge variant="outline" className="text-xs font-semibold bg-secondary/40">
            {eventTypeName} · #{Math.abs(eventData?.guests || 500)}-EST
          </Badge>

          {/* AI / Fallback / Demo Source Badge */}
          {planResult?.source === "ai" && (
            <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-xs font-semibold">
              <Sparkles className="mr-1 h-3 w-3" />
              AI enriched
            </Badge>
          )}
          {planResult?.source === "fallback" && (
            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs font-semibold">
              <ShieldCheck className="mr-1 h-3 w-3" />
              Deterministic estimate
            </Badge>
          )}
          {planResult?.source === "demo" && (
            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs font-semibold">
              <Info className="mr-1 h-3 w-3" />
              Demo data
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrintPlan}
            className="h-9 border-border text-foreground hover:bg-secondary text-xs shadow-xs"
            aria-label="Download or print catering plan"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            Download / Print Plan
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleNewPlan}
            className="h-9 border-border text-foreground hover:bg-secondary text-xs shadow-xs"
            aria-label="Create a new catering plan"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            New Plan
          </Button>
        </div>
      </div>

      {/* ── RESULTS HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 shadow-sm ring-4 ring-emerald-500/10">
          <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.5]" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Your Catering Plan is Ready!
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Here are the AI-powered quantity recommendations for your event.
          </p>
        </div>
      </motion.div>

      {/* ── EVENT SUMMARY CARDS (INCLUDING SEASON) ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        {/* Event Type */}
        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Event Type</span>
          </div>
          <div className="mt-1 font-bold text-sm sm:text-base text-foreground">
            {eventTypeName}
          </div>
        </div>

        {/* Date & Season */}
        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SunMedium className="h-3.5 w-3.5 text-amber-500" />
            <span>Season & Date</span>
          </div>
          <div className="mt-1 font-bold text-sm sm:text-base text-foreground truncate">
            {seasonName}
          </div>
          <div className="text-[10px] text-muted-foreground truncate">
            {eventData?.eventDate || "Upcoming"}
          </div>
        </div>

        {/* Meal Time */}
        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Meal Time</span>
          </div>
          <div className="mt-1 font-bold text-sm sm:text-base text-foreground">
            {mealTimeName}
          </div>
        </div>

        {/* Total Guests */}
        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>Total Guests</span>
          </div>
          <div className="mt-1 font-bold text-sm sm:text-base text-foreground">
            {eventData?.guests || 500}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {eventData?.adults || 420} adults · {eventData?.children || 80} children
          </div>
        </div>

        {/* Guest Mix */}
        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Leaf className="h-3.5 w-3.5 text-emerald-600" />
            <span>Guest Mix</span>
          </div>
          <div className="mt-1 font-bold text-xs sm:text-sm text-foreground">
            {eventData?.vegetarianPct || 70}% Veg / {eventData?.nonVegetarianPct || 30}% Non-Veg
          </div>
        </div>

        {/* Duration */}
        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Duration</span>
          </div>
          <div className="mt-1 font-bold text-sm sm:text-base text-foreground">
            {eventData?.duration || "4"} hours
          </div>
        </div>
      </motion.div>

      {/* ── MAIN DASHBOARD CONTENT (2 COLUMN ON DESKTOP) ── */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* LEFT / MAIN AREA (8 Cols): Category Summary + Recommended Quantities Table */}
        <div className="space-y-6 lg:col-span-8">
          {/* Category Summary bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Category Summary:
            </span>
            {categorySummaries.map((cat) => {
              const Icon = cat.Icon
              return (
                <div
                  key={cat.category}
                  className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1 text-xs shadow-xs"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold text-foreground">{cat.category}</span>
                  <span className="rounded bg-secondary px-1.5 py-0.2 text-[11px] font-medium text-muted-foreground">
                    {cat.summaryText}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Quantity Table */}
          <section aria-labelledby="recommended-quantities-heading">
            <div className="flex items-center justify-between mb-3">
              <h2
                id="recommended-quantities-heading"
                className="text-lg font-bold tracking-tight text-foreground"
              >
                Recommended Quantities
              </h2>
              <span className="text-xs text-muted-foreground">
                {planResult?.estimates?.length || 0} selected dishes
              </span>
            </div>
            <QuantityTable estimates={planResult?.estimates || []} />
          </section>
        </div>

        {/* RIGHT / SIDE AREA (4 Cols): Estimated Impact + AI Explanation */}
        <div className="space-y-6 lg:col-span-4">
          <ImpactPanel
            estimatedTotalCost={planResult?.estimatedTotalCost}
            costFootnote={planResult?.costFootnote}
            estimatedSurplusReduction={planResult?.estimatedSurplusReduction}
            surplusFootnote={planResult?.surplusFootnote}
            estimatedCO2Impact={planResult?.estimatedCO2Impact}
            co2Footnote={planResult?.co2Footnote}
            isBackendSource={planResult?.source !== "demo"}
          />

          <AIExplanation
            explanationIntro={planResult?.explanationIntro}
            reasoningPoints={planResult?.reasoningPoints}
          />
        </div>
      </div>

      {/* ── PRODUCTION VISUALIZATION (FULL WIDTH) ── */}
      <div className="mt-10">
        <QuantityChart estimates={planResult?.estimates || []} />
      </div>

      {/* ── BOTTOM CTA / NAVIGATION ── */}
      <div className="mt-12 pt-6 border-t border-border/80 no-print">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate && onNavigate("/menu")}
            className="border-border text-foreground hover:bg-secondary h-11 px-5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu Selection
          </Button>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleNewPlan}
              className="border-border text-foreground hover:bg-secondary h-11 px-5"
            >
              Start New Plan
            </Button>

            <Button
              type="button"
              onClick={() => onNavigate && onNavigate("/what-if")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20 h-11 px-6 font-semibold"
            >
              <Sliders className="mr-2 h-4 w-4" />
              Try What-If Simulator →
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
