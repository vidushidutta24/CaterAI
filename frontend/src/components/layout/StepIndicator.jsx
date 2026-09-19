import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const DEFAULT_STEPS = [
  { step: 1, label: "Event Details", subtitle: "Scale & guests" },
  { step: 2, label: "Menu Selection", subtitle: "Dishes & dietary" },
  { step: 3, label: "Get Results", subtitle: "AI forecast" },
]

export default function StepIndicator({
  currentStep = 1,
  steps = DEFAULT_STEPS,
  onStepClick,
  className,
}) {
  return (
    <div className={cn("w-full py-4", className)} aria-label="Progress steps">
      {/* Desktop & Tablet View */}
      <nav aria-label="Steps" className="mx-auto max-w-3xl">
        <ol className="flex items-center justify-between">
          {steps.map((item, index) => {
            const isCompleted = item.step < currentStep
            const isActive = item.step === currentStep
            const isUpcoming = item.step > currentStep
            const isClickable = Boolean(onStepClick && isCompleted)

            return (
              <li
                key={item.step}
                className={cn(
                  "relative flex flex-1 items-center",
                  index !== steps.length - 1 && "pr-4 sm:pr-8"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isClickable && "cursor-pointer group"
                  )}
                  onClick={() => isClickable && onStepClick(item.step)}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault()
                      onStepClick(item.step)
                    }
                  }}
                  aria-current={isActive ? "step" : undefined}
                >
                  {/* Step Indicator Circle */}
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all",
                      isCompleted && "bg-emerald-600 text-white shadow-sm",
                      isActive && "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/25 ring-4 ring-primary/20",
                      isUpcoming && "border-2 border-border bg-card text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <span>{item.step}</span>
                    )}
                  </div>

                  {/* Step Text */}
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        isCompleted && "text-emerald-700 dark:text-emerald-400",
                        isActive && "text-primary",
                        isUpcoming && "text-muted-foreground"
                      )}
                    >
                      Step {item.step}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors line-clamp-1",
                        isActive && "text-foreground font-semibold",
                        isCompleted && "text-foreground group-hover:text-primary",
                        isUpcoming && "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>

                {/* Connecting Line between steps */}
                {index !== steps.length - 1 && (
                  <div
                    className="ml-3 hidden h-0.5 flex-1 sm:block transition-colors"
                    aria-hidden="true"
                  >
                    <div
                      className={cn(
                        "h-full w-full rounded-full",
                        item.step < currentStep ? "bg-emerald-500" : "bg-border"
                      )}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
