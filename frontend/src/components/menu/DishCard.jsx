import * as React from "react"
import { motion } from "motion/react"
import {
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
  Check,
} from "lucide-react"
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

export default function DishCard({
  dish,
  isSelected = false,
  onToggle,
  className,
}) {
  const IconComponent = ICON_MAP[dish.icon] || UtensilsCrossed

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onToggle && onToggle(dish.id)
    }
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${dish.name} - ${dish.shortDescription} (${dish.category}, ${dish.unit})`}
      tabIndex={0}
      onClick={() => onToggle && onToggle(dish.id)}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card text-card-foreground text-left cursor-pointer transition-all duration-200 select-none outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isSelected
          ? "border-primary/80 bg-gradient-to-b from-primary/[0.04] to-primary/[0.08] shadow-md shadow-primary/10 ring-1 ring-primary/60"
          : "border-border/80 hover:border-primary/40 hover:shadow-sm",
        className
      )}
    >
      {/* ── CARD VISUAL AREA ── */}
      <div
        className={cn(
          "relative h-32 w-full overflow-hidden border-b border-border/50 transition-colors",
          dish.accent ? `bg-gradient-to-br ${dish.accent}` : "bg-gradient-to-br from-secondary/80 to-accent/40"
        )}
        style={{
          backgroundImage: dish.bgPattern,
        }}
      >
        {/* Subtle decorative circles for depth */}
        <div
          aria-hidden="true"
          className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full border border-foreground/5 opacity-60 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -left-4 -top-4 h-20 w-20 rounded-full border border-foreground/5 opacity-40 pointer-events-none"
        />

        {/* Top bar over visual: Dietary tag and Checkbox control */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2.5 z-10">
          {/* Dietary badge */}
          <div className="flex items-center gap-1.5">
            {dish.dietary === "veg" ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 backdrop-blur-sm shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Veg
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-600/30 bg-rose-500/15 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 backdrop-blur-sm shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Non-Veg
              </span>
            )}

            {dish.tag && (
              <span className="hidden sm:inline-flex items-center rounded-full bg-background/75 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm border border-border/40">
                {dish.tag}
              </span>
            )}
          </div>

          {/* Accessible Checkbox control */}
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-200 shadow-xs",
              isSelected
                ? "border-primary bg-primary text-primary-foreground scale-105"
                : "border-border/80 bg-background/80 text-transparent group-hover:border-primary/50 group-hover:text-muted-foreground/30 backdrop-blur-sm"
            )}
            aria-hidden="true"
          >
            <motion.div
              initial={false}
              animate={{ scale: isSelected ? 1 : 0.6, opacity: isSelected ? 1 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </motion.div>
          </div>
        </div>

        {/* Central visual illustration: Icon badge */}
        <div className="flex h-full w-full items-center justify-center pt-2">
          <motion.div
            animate={{
              scale: isSelected ? 1.08 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm backdrop-blur-md transition-all duration-200",
              isSelected
                ? "bg-background shadow-primary/20 ring-2 ring-primary/40"
                : "bg-background/80 group-hover:bg-background group-hover:shadow-md border border-border/40"
            )}
          >
            <IconComponent className={cn("h-8 w-8 transition-transform group-hover:scale-105", dish.iconColor || "text-primary")} />
          </motion.div>
        </div>
      </div>

      {/* ── CARD CONTENT AREA ── */}
      <div className="flex flex-1 flex-col justify-between p-3.5 space-y-2.5">
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <h3 className={cn(
              "font-semibold text-sm leading-tight transition-colors",
              isSelected ? "text-primary font-bold" : "text-foreground group-hover:text-primary"
            )}>
              {dish.name}
            </h3>
          </div>

          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {dish.shortDescription}
          </p>
        </div>

        {/* Footer meta: Category & Unit */}
        <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground/75">
            {dish.category}
          </span>
          <span className="rounded bg-secondary/80 px-1.5 py-0.5 font-medium text-foreground/70">
            {dish.unit}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
