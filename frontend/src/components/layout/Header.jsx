import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChefHat, User, Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header({ currentRoute = "/", onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Nav links — anchor-prefixed routes (#) are home-page scrolls and never "active" on app routes
  const navLinks = [
    { label: "Home", route: "/", exact: true },
    { label: "Features", route: "/#features", exact: false },
    { label: "How it works", route: "/#how-it-works", exact: false },
    { label: "Demo", route: "/#demo", exact: false },
  ]

  const handleNavClick = (route, e) => {
    if (e) e.preventDefault()
    setMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(route)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <button
          type="button"
          onClick={(e) => handleNavClick("/", e)}
          className="group flex items-center gap-2.5 rounded-lg text-left transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="CaterAI Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-transform group-hover:scale-105">
            <ChefHat className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold tracking-tight text-foreground">
              Cater<span className="text-primary">AI</span>
            </span>
          </div>
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
          {navLinks.map((item) => {
            // Anchor-only links (/#...) are never "active" — they just scroll the home page
            const isActive = item.exact ? currentRoute === item.route : false
            return (
              <button
                key={item.label}
                type="button"
                onClick={(e) => handleNavClick(item.route, e)}
                className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-[18px] left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Account Icon (Visual Only) */}
          <button
            type="button"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="User Account"
            title="User Account"
          >
            <User className="h-4 w-4" />
          </button>

          {/* Primary CTA: Get Started */}
          <Button
            size="sm"
            onClick={(e) => handleNavClick("/event", e)}
            className="group hidden sm:inline-flex items-center gap-1.5 bg-primary font-medium text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-card px-4 pt-2 pb-4 shadow-lg md:hidden"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={(e) => handleNavClick(item.route, e)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium transition-colors ${
                    (item.exact ? currentRoute === item.route : false)
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 border-t border-border/80 mt-2 flex flex-col gap-2">
                <Button
                  onClick={(e) => handleNavClick("/event", e)}
                  className="w-full justify-center bg-primary text-primary-foreground shadow-sm"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
