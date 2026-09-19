import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export default function PageContainer({
  children,
  className,
  maxWidth = "7xl",
  centered = false,
  animate = true,
  ...props
}) {
  const maxWidthMap = {
    sm: "max-w-2xl",
    md: "max-w-3xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  }

  const containerClasses = cn(
    "mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10",
    maxWidthMap[maxWidth] || "max-w-7xl",
    centered && "flex flex-col items-center",
    className
  )

  if (!animate) {
    return (
      <main className={containerClasses} {...props}>
        {children}
      </main>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={containerClasses}
      {...props}
    >
      {children}
    </motion.main>
  )
}
