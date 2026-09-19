import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Utensils,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Calendar,
  Users,
  Flame,
  Salad,
  Cake,
  CupSoda,
  Wheat,
  UtensilsCrossed,
  Layers,
} from "lucide-react"
import PageContainer from "@/components/layout/PageContainer"
import SectionHeader from "@/components/layout/SectionHeader"
import StepIndicator from "@/components/layout/StepIndicator"
import DishCard from "@/components/menu/DishCard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/lib/AppContext"
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  POPULAR_WEDDING_DISH_IDS,
} from "@/data/menu"
import { cn } from "@/lib/utils"

const CATEGORY_ICONS = {
  Starters: Flame,
  "Main Course": UtensilsCrossed,
  Bread: Wheat,
  Desserts: Cake,
  Drinks: CupSoda,
}

export default function MenuSelection({ onNavigate }) {
  const {
    eventData,
    selectedMenu,
    toggleDish,
    selectDishes,
    clearMenu,
    isDishSelected,
  } = useAppContext()

  const [activeTab, setActiveTab] = React.useState("all")

  // Format dynamic event summary from shared context
  const eventSummaryText = React.useMemo(() => {
    const parts = []
    if (eventData?.eventType) {
      const typeMap = {
        wedding: "Wedding",
        reception: "Reception",
        engagement: "Engagement",
        birthday: "Birthday",
        corporate: "Corporate Event",
      }
      parts.push(typeMap[eventData.eventType] || eventData.eventType)
    } else {
      parts.push("Event")
    }

    if (eventData?.mealTime) {
      parts.push(
        eventData.mealTime.charAt(0).toUpperCase() +
          eventData.mealTime.slice(1)
      )
    } else {
      parts.push("Dinner")
    }

    const guests = eventData?.guests || 500
    parts.push(`${guests} guests`)

    return parts.join(" · ")
  }, [eventData])

  // Count items per category
  const categoryCounts = React.useMemo(() => {
    const counts = {}
    MENU_CATEGORIES.forEach((cat) => {
      counts[cat] = 0
    })

    selectedMenu.forEach((dishId) => {
      const dish = MENU_ITEMS.find((d) => d.id === dishId)
      if (dish && counts[dish.category] !== undefined) {
        counts[dish.category] += 1
      }
    })

    return counts
  }, [selectedMenu])

  const totalSelected = selectedMenu.length
  const isFormValid = totalSelected >= 1

  // Handle Quick Action: Popular Wedding Menu
  const handleApplyPopularMenu = () => {
    selectDishes(POPULAR_WEDDING_DISH_IDS)
  }

  // Handle category jump / scroll
  const scrollToCategory = (category) => {
    setActiveTab(category)
    if (category === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const safeId = `category-${category.toLowerCase().replace(/\s+/g, "-")}`
    const el = document.getElementById(safeId)
    if (el) {
      const yOffset = -120 // offset for sticky bar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Select all or clear specific category
  const handleToggleCategory = (category) => {
    const catDishes = MENU_ITEMS.filter((d) => d.category === category).map(
      (d) => d.id
    )
    const allSelected = catDishes.every((id) => selectedMenu.includes(id))

    if (allSelected) {
      // Remove these from selection
      const newSelection = selectedMenu.filter((id) => !catDishes.includes(id))
      selectDishes(newSelection)
    } else {
      // Add all missing ones
      const newSelection = Array.from(new Set([...selectedMenu, ...catDishes]))
      selectDishes(newSelection)
    }
  }

  const handleContinue = () => {
    if (!isFormValid) return
    if (onNavigate) {
      onNavigate("/results")
    }
  }

  return (
    <PageContainer maxWidth="xl" className="pb-24">
      {/* ── STEP INDICATOR ── */}
      <StepIndicator
        currentStep={2}
        onStepClick={(s) => {
          if (s === 1 && onNavigate) onNavigate("/event")
          if (s === 2 && onNavigate) onNavigate("/menu")
          if (s === 3 && onNavigate && isFormValid) onNavigate("/results")
        }}
      />

      {/* ── COMPACT DYNAMIC EVENT SUMMARY ── */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/80 p-3.5 sm:px-5 backdrop-blur-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Catering Context
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {eventData?.vegetarianPct || 70}% Veg /{" "}
                {eventData?.nonVegetarianPct || 30}% Non-Veg
              </span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {eventSummaryText}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onNavigate && onNavigate("/event")}
          className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
        >
          Edit details
        </Button>
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="mt-6 sm:mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <SectionHeader
            eyebrow="STEP 2"
            title="Select your menu"
            description="Choose the dishes you plan to serve. Our AI will estimate the quantities."
            className="text-left"
          />
        </div>

        {/* Quick action: Popular wedding menu */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApplyPopularMenu}
            className="group border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-foreground font-medium text-xs shadow-xs h-9"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary transition-transform group-hover:rotate-12" />
            Use popular wedding menu
            <span className="ml-1.5 rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
              10 dishes
            </span>
          </Button>

          {totalSelected > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearMenu}
              className="text-xs text-muted-foreground hover:text-destructive h-9 px-2.5"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              Clear selection
            </Button>
          )}
        </div>
      </div>

      {/* ── STICKY SELECTION SUMMARY & FILTER BAR ── */}
      <div className="sticky top-16 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 mt-6 bg-background/90 backdrop-blur-md border-y sm:border sm:rounded-xl border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main selection badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                Menu
              </span>
              <motion.div
                key={totalSelected}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Badge
                  variant={totalSelected > 0 ? "default" : "secondary"}
                  className={cn(
                    "px-2.5 py-0.5 text-xs font-semibold transition-colors",
                    totalSelected > 0
                      ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {totalSelected} {totalSelected === 1 ? "dish" : "dishes"} selected
                </Badge>
              </motion.div>
            </div>

            {totalSelected === 0 && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Select at least 1 dish
              </span>
            )}
          </div>

          {/* Category Chips / Quick filter navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => scrollToCategory("all")}
              className={cn(
                "shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                activeTab === "all"
                  ? "bg-secondary text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              All ({MENU_ITEMS.length})
            </button>

            {MENU_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0
              const isActive = activeTab === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => scrollToCategory(cat)}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <span>{cat}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                      count > 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── CATEGORY SECTIONS ── */}
      <div className="mt-8 space-y-12">
        {MENU_CATEGORIES.map((category) => {
          const dishes = MENU_ITEMS.filter((d) => d.category === category)
          const selectedInCat = dishes.filter((d) =>
            selectedMenu.includes(d.id)
          ).length
          const allInCatSelected =
            dishes.length > 0 && selectedInCat === dishes.length
          const CategoryIcon = CATEGORY_ICONS[category] || Utensils
          const safeId = `category-${category.toLowerCase().replace(/\s+/g, "-")}`

          return (
            <section
              key={category}
              id={safeId}
              className="scroll-mt-36"
              aria-labelledby={`${safeId}-heading`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CategoryIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2
                      id={`${safeId}-heading`}
                      className="text-base sm:text-lg font-bold tracking-tight text-foreground uppercase"
                    >
                      {category}
                    </h2>
                  </div>
                  <span className="ml-2 inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {selectedInCat} selected
                  </span>
                </div>

                {/* Select All / Deselect All category shortcut */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleCategory(category)}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-primary font-medium"
                >
                  {allInCatSelected ? "Deselect category" : "Select all in category"}
                </Button>
              </div>

              {/* Dish Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {dishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    isSelected={isDishSelected(dish.id)}
                    onToggle={toggleDish}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* ── BOTTOM ACTION BAR ── */}
      <div className="mt-14 pt-6 border-t border-border/80">
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate && onNavigate("/event")}
            className="border-border text-foreground hover:bg-secondary h-11 px-5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event Details
          </Button>

          <div className="flex flex-col sm:items-end gap-1.5">
            <motion.div
              whileHover={isFormValid ? { scale: 1.01 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
            >
              <Button
                type="button"
                disabled={!isFormValid}
                onClick={handleContinue}
                className={cn(
                  "w-full sm:w-auto h-11 px-7 font-semibold transition-all shadow-sm",
                  isFormValid
                    ? "bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary/90"
                    : "opacity-50 cursor-not-allowed"
                )}
              >
                Generate AI Catering Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {!isFormValid && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 sm:justify-end">
                <AlertCircle className="h-3 w-3 shrink-0" />
                Select at least 1 dish to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
