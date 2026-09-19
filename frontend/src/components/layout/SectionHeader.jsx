import * as React from "react"
import { cn } from "@/lib/utils"

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6",
        align === "center" && "text-center sm:text-center sm:items-center",
        className
      )}
    >
      <div className={cn("space-y-1.5", align === "center" && "mx-auto max-w-2xl")}>
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </div>
        )}
        {title && (
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0 flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  )
}
