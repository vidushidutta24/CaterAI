import * as React from "react"
import { motion, useInView } from "motion/react"
import {
  ChefHat,
  Users,
  Calendar,
  Sparkles,
  Leaf,
  TrendingDown,
  ArrowRight,
  Check,
  Brain,
  Utensils,
  Clock,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────
   Animation helpers
───────────────────────────────────────────── */
function FadeIn({ children, delay = 0, y = 16, className }) {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Hero product preview card
───────────────────────────────────────────── */
const DEMO_DISHES = [
  { name: "Paneer Tikka", qty: "18 kg", conf: "High" },
  { name: "Butter Chicken", qty: "14 kg", conf: "High" },
  { name: "Biryani", qty: "55 kg", conf: "High" },
  { name: "Naan", qty: "650 pcs", conf: "Medium" },
  { name: "Gulab Jamun", qty: "450 pcs", conf: "Medium" },
]

function HeroPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
      className="relative"
    >
      {/* Subtle glow behind card */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-3xl bg-primary/10 blur-2xl"
      />

      <Card className="relative overflow-hidden border border-border/80 bg-card shadow-xl shadow-black/6 ring-1 ring-black/[0.04]">
        {/* Card header */}
        <div className="flex items-start justify-between border-b border-border/60 bg-secondary/40 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ChefHat className="h-4.5 w-4.5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Catering Plan
              </p>
              <p className="text-sm font-bold text-foreground">500 Guests · Wedding · Dinner</p>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5">
            Demo Plan
          </Badge>
        </div>

        <CardContent className="p-0">
          {/* Event details row */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 border-b border-border/40 px-5 py-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-primary/70" />
              420 Adults · 80 Children
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Leaf className="h-3.5 w-3.5 text-emerald-600" />
              70% Vegetarian
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary/70" />
              4 Hours · Evening
            </span>
          </div>

          {/* Dish quantities */}
          <div className="divide-y divide-border/40">
            {DEMO_DISHES.map((dish, i) => (
              <div
                key={dish.name}
                className="flex items-center justify-between px-5 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-1.5 w-1.5 rounded-full bg-primary/50" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">{dish.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {dish.qty}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      dish.conf === "High"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {dish.conf}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI attribution footer */}
          <div className="flex items-center gap-1.5 border-t border-border/40 bg-secondary/30 px-5 py-2.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">
              AI-powered estimate · Illustrative demo data only
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Value Proposition Cards
───────────────────────────────────────────── */
const VALUE_PROPS = [
  {
    num: "01",
    icon: Users,
    title: "Guest Profile",
    body: "Understand attendance, adults, children and dietary mix.",
  },
  {
    num: "02",
    icon: Calendar,
    title: "Event Context",
    body: "Account for timing, duration, event type and seasonal context.",
  },
  {
    num: "03",
    icon: Brain,
    title: "AI Estimate",
    body: "Generate dish-level quantity recommendations instantly.",
  },
]

function ValueCard({ card, index }) {
  const Icon = card.icon
  return (
    <FadeIn delay={0.1 + index * 0.1}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full border border-border/80 bg-card shadow-sm shadow-black/4 hover:shadow-md hover:shadow-black/6 transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-3xl font-bold tabular-nums text-border/70 select-none">
                {card.num}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
            </div>
            <h3 className="mb-1.5 text-base font-semibold text-foreground">
              {card.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
          </CardContent>
        </Card>
      </motion.div>
    </FadeIn>
  )
}

/* ─────────────────────────────────────────────
   How it Works Steps
───────────────────────────────────────────── */
const HOW_STEPS = [
  {
    num: "01",
    title: "Tell us about your event",
    body: "Guest count, event type, date, venue, and dietary mix.",
    icon: Calendar,
  },
  {
    num: "02",
    title: "Choose your menu",
    body: "Select dishes from categories. Adjust portions to suit your cuisine.",
    icon: Utensils,
  },
  {
    num: "03",
    title: "Get your AI catering plan",
    body: "Receive dish-level quantities with confidence scores.",
    icon: Sparkles,
  },
]

function HowItWorksStep({ step, index, isLast }) {
  const Icon = step.icon
  return (
    <FadeIn delay={0.1 + index * 0.15} className="flex flex-1 flex-col items-center text-center">
      <div className="relative flex w-full flex-col items-center">
        {/* Number badge */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>

        {/* Connector line on desktop */}
        {!isLast && (
          <div
            aria-hidden="true"
            className="absolute left-[calc(50%+32px)] top-7 hidden h-0.5 w-[calc(100%-64px)] bg-border/60 lg:block"
          />
        )}

        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
          Step {step.num}
        </p>
        <h3 className="mb-1.5 text-base font-semibold text-foreground">{step.title}</h3>
        <p className="max-w-[200px] text-sm leading-relaxed text-muted-foreground">{step.body}</p>
      </div>
    </FadeIn>
  )
}

/* ─────────────────────────────────────────────
   Product Preview section
───────────────────────────────────────────── */
function ProductPreview() {
  return (
    <FadeIn>
      <Card className="overflow-hidden border border-border/80 bg-card shadow-lg shadow-black/6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border/60 bg-secondary/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <ChefHat className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">CaterAI Results</span>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/8 text-primary text-xs">
            AI-powered estimate
          </Badge>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: Event Summary */}
          <div className="border-b border-border/60 p-6 lg:border-b-0 lg:border-r">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Event Summary
            </p>
            <div className="space-y-2.5">
              {[
                { icon: Users, label: "Total Guests", value: "500" },
                { icon: Users, label: "Adults / Children", value: "420 / 80" },
                { icon: Leaf, label: "Vegetarian", value: "70%" },
                { icon: Utensils, label: "Non-Vegetarian", value: "30%" },
                { icon: Clock, label: "Duration", value: "4 Hours" },
                { icon: Calendar, label: "Meal Service", value: "Dinner" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary/60" />
                    {label}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Recommended Quantities */}
          <div className="p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recommended Quantities
            </p>
            <div className="space-y-1.5">
              {[
                { name: "Paneer Tikka", qty: "18 kg", pct: 75 },
                { name: "Biryani", qty: "55 kg", pct: 95 },
                { name: "Naan", qty: "650 pcs", pct: 88 },
                { name: "Gulab Jamun", qty: "450 pcs", pct: 70 },
              ].map((dish) => (
                <div key={dish.name} className="group rounded-lg px-3 py-2.5 hover:bg-secondary/60 transition-colors">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{dish.name}</span>
                    <span className="text-sm font-bold tabular-nums text-foreground">{dish.qty}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${dish.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI explanation card */}
            <div className="mt-4 rounded-xl border border-border/60 bg-secondary/40 p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">Why these quantities?</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Recommendations consider guest distribution, meal timing, event context and the selected menu.
              </p>
              <p className="mt-1.5 text-[10px] text-muted-foreground/70 italic">
                Illustrative demo data only.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </FadeIn>
  )
}

/* ─────────────────────────────────────────────
   Main Home page
───────────────────────────────────────────── */
export default function Home({ onNavigate }) {
  const handleCTA = () => onNavigate && onNavigate("/event")

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════ */}
      <section
        className="relative mx-auto max-w-7xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24"
        aria-label="Hero"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-3 w-3" />
                AI Catering Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.07 }}
              className="mb-5 text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[52px]"
            >
              Stop guessing.{" "}
              <br />
              <span className="text-primary">Start planning.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.13 }}
              className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              AI-powered catering quantity estimation for weddings and large events.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <Button
                size="lg"
                onClick={handleCTA}
                className="group bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all font-semibold"
              >
                Create Catering Plan
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("how-it-works")
                  el?.scrollIntoView({ behavior: "smooth" })
                }}
                className="border-border text-foreground hover:bg-secondary font-medium"
              >
                View Demo
              </Button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-5 border-t border-border/60 pt-6"
            >
              {[
                { icon: Leaf, label: "Reduce Food Waste" },
                { icon: TrendingDown, label: "Save Costs" },
                { icon: Star, label: "Plan Smarter" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary/70" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Product preview card */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Background decoration */}
            <div
              aria-hidden="true"
              className="absolute -top-10 -right-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"
            />
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-full">
              <HeroPreviewCard />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. VALUE PROPOSITION
      ═══════════════════════════════════════ */}
      <section
        id="features"
        className="border-y border-border/60 bg-secondary/30 py-16 sm:py-20"
        aria-label="Why CaterAI"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Why CaterAI
            </span>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              From guest lists to production plans.
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
              CaterAI helps caterers make quantity decisions using the context that actually affects consumption.
            </p>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUE_PROPS.map((card, i) => (
              <ValueCard key={card.num} card={card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="py-16 sm:py-20"
        aria-label="How it works"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              How it works
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Plan in three simple steps.
            </h2>
          </FadeIn>

          <div className="relative grid gap-10 sm:grid-cols-3 lg:gap-6">
            {HOW_STEPS.map((step, i) => (
              <HowItWorksStep key={step.num} step={step} index={i} isLast={i === HOW_STEPS.length - 1} />
            ))}
          </div>

          <FadeIn delay={0.4} className="mt-12 flex justify-center">
            <Button
              onClick={handleCTA}
              size="lg"
              className="group bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 font-semibold"
            >
              Create My Catering Plan
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. PRODUCT PREVIEW
      ═══════════════════════════════════════ */}
      <section
        id="demo"
        className="border-t border-border/60 bg-secondary/30 py-16 sm:py-20"
        aria-label="Product preview"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Product Preview
            </span>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              See what CaterAI gives you.
            </h2>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
              A complete quantity plan — calibrated to your guests, menu, and event context.
            </p>
          </FadeIn>

          <ProductPreview />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. FINAL CTA
      ═══════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        aria-label="Call to action"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-14 text-center shadow-lg shadow-primary/20 sm:px-12">
              {/* Subtle background texture */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
              </div>

              <div className="relative">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
                  Get started today
                </p>
                <h2 className="mb-3 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                  Ready to stop guessing?
                </h2>
                <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-primary-foreground/80">
                  Build your first catering plan in minutes.
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    onClick={handleCTA}
                    className="border border-white/20 bg-white font-semibold text-primary shadow-md hover:bg-white/90"
                  >
                    Create Catering Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
