import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Heart, Sparkles, Cake, BriefcaseBusiness,
  CalendarDays, Clock, Users, Baby,
  Leaf, Utensils, ArrowRight, ArrowLeft,
  Info, Check, AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import StepIndicator from "@/components/layout/StepIndicator"
import SectionHeader from "@/components/layout/SectionHeader"
import PageContainer from "@/components/layout/PageContainer"
import { useAppContext } from "@/lib/AppContext"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────
   Event type config
───────────────────────────────────────────── */
const EVENT_TYPES = [
  { value: "wedding",     label: "Wedding",     icon: Heart },
  { value: "reception",   label: "Reception",   icon: Sparkles },
  { value: "engagement",  label: "Engagement",  icon: Heart },
  { value: "birthday",    label: "Birthday",    icon: Cake },
  { value: "corporate",   label: "Corporate",   icon: BriefcaseBusiness },
]

const MEAL_TIMES = [
  { value: "lunch",  label: "Lunch",  sub: "12 PM – 3 PM" },
  { value: "dinner", label: "Dinner", sub: "7 PM – 11 PM" },
]

const DURATIONS = ["2", "3", "4", "5", "6+"]

const SEASONS = [
  { value: "winter",  label: "Winter" },
  { value: "spring",  label: "Spring" },
  { value: "summer",  label: "Summer" },
  { value: "monsoon", label: "Monsoon" },
]

/* ─────────────────────────────────────────────
   Small helpers
───────────────────────────────────────────── */
function FieldLabel({ children, htmlFor, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-semibold text-foreground mb-1.5", className)}
    >
      {children}
    </label>
  )
}

function HelperText({ children }) {
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
      <Info className="h-3 w-3 shrink-0" />
      {children}
    </p>
  )
}

function ErrorText({ children }) {
  return (
    <AnimatePresence>
      {children && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-1 flex items-center gap-1 text-xs font-medium text-destructive"
          role="alert"
        >
          <AlertCircle className="h-3 w-3 shrink-0" />
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function SectionDivider({ label }) {
  return (
    <div className="mb-5 mt-8 flex items-center gap-3">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/70" />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Dietary bar visualizer
───────────────────────────────────────────── */
function DietaryBar({ vegPct }) {
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border/60">
      <motion.div
        className="h-full rounded-full bg-emerald-500"
        animate={{ width: `${Math.min(100, Math.max(0, vegPct))}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   EventSetup page
───────────────────────────────────────────── */
export default function EventSetup({ onNavigate }) {
  const { eventData, updateEventData } = useAppContext()

  // Local form state (synced with context on submit)
  const [form, setForm] = React.useState({
    eventType:       eventData.eventType,
    eventDate:       eventData.eventDate,
    mealTime:        eventData.mealTime,
    season:          eventData.season || "winter",
    guests:          String(eventData.guests),
    adults:          String(eventData.adults),
    children:        String(eventData.children),
    vegetarianPct:   String(eventData.vegetarianPct),
    nonVegetarianPct: String(eventData.nonVegetarianPct),
    duration:        eventData.duration,
  })

  // Track which fields have been "touched" by the user to avoid early validation noise
  const [touched, setTouched] = React.useState({})
  const [submitAttempted, setSubmitAttempted] = React.useState(false)

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }))

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    touch(field)
  }

  /* ── Derived numeric values ── */
  const numGuests = parseInt(form.guests) || 0
  const numAdults = parseInt(form.adults) || 0
  const numChildren = parseInt(form.children) || 0
  const vegPct = parseInt(form.vegetarianPct) || 0
  const nonVegPct = parseInt(form.nonVegetarianPct) || 0

  /* ── Per-field validation ── */
  const errors = {}

  if (!form.eventType) errors.eventType = "Please select an event type."
  if (!form.eventDate) errors.eventDate = "Please select a date."
  if (!form.mealTime) errors.mealTime = "Please select a meal time."
  if (!form.season) errors.season = "Please select a season."
  if (!form.duration) errors.duration = "Please select a duration."

  if (numGuests <= 0) errors.guests = "Expected guests must be greater than 0."
  if (numAdults < 0) errors.adults = "Adults cannot be negative."
  if (numChildren < 0) errors.children = "Children cannot be negative."
  if (
    numGuests > 0 &&
    (numAdults >= 0 && numChildren >= 0) &&
    numAdults + numChildren !== numGuests
  ) {
    errors.guestSplit = "Adults + children must equal expected guests."
  }

  if (vegPct < 0 || nonVegPct < 0) errors.dietary = "Percentages cannot be negative."
  if (vegPct + nonVegPct !== 100) {
    errors.dietary = "Vegetarian + non-vegetarian must equal 100%."
  }

  const shouldShow = (field) => touched[field] || submitAttempted

  const isFormValid = Object.keys(errors).length === 0

  /* ── Handle dietary % sync: veg changes auto-adjust non-veg ── */
  const handleVegChange = (val) => {
    const v = Math.min(100, Math.max(0, parseInt(val) || 0))
    setForm((f) => ({ ...f, vegetarianPct: String(v), nonVegetarianPct: String(100 - v) }))
    touch("vegetarianPct")
    touch("nonVegetarianPct")
  }

  const handleNonVegChange = (val) => {
    const v = Math.min(100, Math.max(0, parseInt(val) || 0))
    setForm((f) => ({ ...f, nonVegetarianPct: String(v), vegetarianPct: String(100 - v) }))
    touch("vegetarianPct")
    touch("nonVegetarianPct")
  }

  /* ── Handle submit ── */
  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (!isFormValid) return

    updateEventData({
      eventType:          form.eventType,
      eventDate:          form.eventDate,
      mealTime:           form.mealTime,
      season:             form.season,
      guests:             numGuests,
      adults:             numAdults,
      children:           numChildren,
      vegetarianPct:      vegPct,
      nonVegetarianPct:   nonVegPct,
      duration:           form.duration,
    })

    onNavigate && onNavigate("/menu")
  }

  return (
    <PageContainer maxWidth="lg">
      {/* Step Indicator */}
      <StepIndicator
        currentStep={1}
        onStepClick={(s) => {
          if (s === 2) onNavigate("/menu")
          if (s === 3) onNavigate("/results")
        }}
      />

      <SectionHeader
        eyebrow="STEP 1"
        title="Tell us about your event"
        description="Provide a few details so we can give you accurate quantity recommendations."
        className="mt-6"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
      >
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardContent className="p-6 sm:p-8">

            {/* ── EVENT TYPE ── */}
            <div>
              <FieldLabel>Event Type</FieldLabel>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                {EVENT_TYPES.map((et) => {
                  const Icon = et.icon
                  const isSelected = form.eventType === et.value
                  return (
                    <motion.button
                      key={et.value}
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setField("eventType", et.value)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected
                          ? "border-primary bg-accent text-primary shadow-sm shadow-primary/10"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn("h-4.5 w-4.5", isSelected ? "text-primary" : "text-muted-foreground")}
                        strokeWidth={1.8}
                      />
                      {et.label}
                      {isSelected && (
                        <span className="sr-only"> (selected)</span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
              <ErrorText>{shouldShow("eventType") && errors.eventType}</ErrorText>
            </div>

            {/* ── DATE + SEASON + MEAL TIME ── */}
            <SectionDivider label="Date, Season & Time" />
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <FieldLabel htmlFor="eventDate">Event Date</FieldLabel>
                <Input
                  id="eventDate"
                  type="date"
                  value={form.eventDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setField("eventDate", e.target.value)}
                  onBlur={() => touch("eventDate")}
                  aria-invalid={shouldShow("eventDate") && !!errors.eventDate}
                  className="h-10 w-full border-input bg-background"
                />
                <ErrorText>{shouldShow("eventDate") && errors.eventDate}</ErrorText>
              </div>

              <div>
                <FieldLabel htmlFor="season">Season</FieldLabel>
                <Select
                  value={form.season}
                  onValueChange={(val) => setField("season", val)}
                >
                  <SelectTrigger
                    id="season"
                    aria-label="Event season"
                    className="h-10 w-full border-input bg-background"
                  >
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorText>{shouldShow("season") && errors.season}</ErrorText>
              </div>

              <div>
                <FieldLabel>Meal Service</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  {MEAL_TIMES.map((mt) => {
                    const isSelected = form.mealTime === mt.value
                    return (
                      <button
                        key={mt.value}
                        type="button"
                        onClick={() => setField("mealTime", mt.value)}
                        aria-pressed={isSelected}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? "border-primary bg-accent text-primary shadow-sm"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <span className="font-semibold">{mt.label}</span>
                        <span className="text-[10px] opacity-70">{mt.sub}</span>
                      </button>
                    )
                  })}
                </div>
                <ErrorText>{shouldShow("mealTime") && errors.mealTime}</ErrorText>
              </div>
            </div>

            {/* ── GUEST PROFILE ── */}
            <SectionDivider label="Guest Profile" />
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <FieldLabel htmlFor="guests">Expected Guests</FieldLabel>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  value={form.guests}
                  onChange={(e) => setField("guests", e.target.value)}
                  onBlur={() => touch("guests")}
                  aria-invalid={(shouldShow("guests") && !!errors.guests) || (shouldShow("guestSplit") && !!errors.guestSplit)}
                  className="h-10 border-input bg-background"
                />
                <HelperText>Total people at the event.</HelperText>
                <ErrorText>{shouldShow("guests") && errors.guests}</ErrorText>
              </div>

              <div>
                <FieldLabel htmlFor="adults">Adults</FieldLabel>
                <Input
                  id="adults"
                  type="number"
                  min="0"
                  value={form.adults}
                  onChange={(e) => setField("adults", e.target.value)}
                  onBlur={() => touch("adults")}
                  aria-invalid={shouldShow("guestSplit") && !!errors.guestSplit}
                  className="h-10 border-input bg-background"
                />
                <HelperText>Guests aged 13 and above.</HelperText>
              </div>

              <div>
                <FieldLabel htmlFor="children">Children</FieldLabel>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  value={form.children}
                  onChange={(e) => setField("children", e.target.value)}
                  onBlur={() => touch("children")}
                  aria-invalid={shouldShow("guestSplit") && !!errors.guestSplit}
                  className="h-10 border-input bg-background"
                />
                <HelperText>Guests aged 12 and below.</HelperText>
              </div>
            </div>

            {/* Guest split validation */}
            <AnimatePresence>
              {shouldShow("guestSplit") && errors.guestSplit && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-2 flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.guestSplit}
                </motion.div>
              )}
              {shouldShow("adults") && !errors.guestSplit && numAdults + numChildren === numGuests && numGuests > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700"
                  role="status"
                >
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  Guest split looks good — {numAdults} adults + {numChildren} children = {numGuests} guests.
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── DIETARY MIX ── */}
            <SectionDivider label="Guest Dietary Mix" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="vegPct">Vegetarian %</FieldLabel>
                <div className="flex items-center gap-2.5">
                  <Leaf className="h-4 w-4 shrink-0 text-emerald-600" />
                  <Input
                    id="vegPct"
                    type="number"
                    min="0"
                    max="100"
                    value={form.vegetarianPct}
                    onChange={(e) => handleVegChange(e.target.value)}
                    aria-invalid={shouldShow("vegetarianPct") && !!errors.dietary}
                    className="h-10 border-input bg-background"
                  />
                  <span className="shrink-0 text-sm font-semibold text-muted-foreground">%</span>
                </div>
                <HelperText>Estimated share following a vegetarian diet.</HelperText>
              </div>

              <div>
                <FieldLabel htmlFor="nonVegPct">Non-Vegetarian %</FieldLabel>
                <div className="flex items-center gap-2.5">
                  <Utensils className="h-4 w-4 shrink-0 text-amber-600" />
                  <Input
                    id="nonVegPct"
                    type="number"
                    min="0"
                    max="100"
                    value={form.nonVegetarianPct}
                    onChange={(e) => handleNonVegChange(e.target.value)}
                    aria-invalid={shouldShow("nonVegetarianPct") && !!errors.dietary}
                    className="h-10 border-input bg-background"
                  />
                  <span className="shrink-0 text-sm font-semibold text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            {/* Dietary bar + validation */}
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Vegetarian {vegPct}%
                </span>
                <span className="flex items-center gap-1 font-medium text-amber-700">
                  Non-Veg {nonVegPct}%
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                </span>
              </div>
              <DietaryBar vegPct={vegPct} />
            </div>

            <AnimatePresence>
              {(shouldShow("vegetarianPct") || shouldShow("nonVegetarianPct")) && errors.dietary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-2 flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.dietary}
                </motion.div>
              )}
              {!errors.dietary && vegPct + nonVegPct === 100 && touched.vegetarianPct && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700"
                  role="status"
                >
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  Dietary mix totals 100%.
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── DURATION ── */}
            <SectionDivider label="Event Duration" />
            <div className="sm:max-w-xs">
              <FieldLabel htmlFor="duration">How long will the event run?</FieldLabel>
              <Select
                value={form.duration}
                onValueChange={(val) => setField("duration", val)}
              >
                <SelectTrigger
                  id="duration"
                  aria-label="Event duration"
                  className="h-10 w-full border-input bg-background"
                >
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d} {d === "6+" ? "hours or more" : "hours"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorText>{shouldShow("duration") && errors.duration}</ErrorText>
            </div>

            {/* ── SUBMIT VALIDATION SUMMARY ── */}
            <AnimatePresence>
              {submitAttempted && !isFormValid && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  role="alert"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Please fix the errors above before continuing.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── ACTIONS ── */}
            <div className="mt-8 flex flex-col-reverse items-stretch gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate && onNavigate("/")}
                className="border-border text-foreground hover:bg-secondary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className={cn(
                    "group w-full sm:w-auto bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 font-semibold transition-all",
                    !isFormValid && submitAttempted && "opacity-80"
                  )}
                >
                  Next: Select Menu
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </motion.div>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </PageContainer>
  )
}
