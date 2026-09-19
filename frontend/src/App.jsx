import * as React from "react"
import { AppProvider } from "@/lib/AppContext"
import Header from "@/components/layout/Header"
import Home from "@/pages/Home"
import EventSetup from "@/pages/EventSetup"
import MenuSelection from "@/pages/MenuSelection"
import ResultsDashboard from "@/pages/ResultsDashboard"
import WhatIfSimulator from "@/pages/WhatIfSimulator"

const VALID_ROUTES = ["/", "/event", "/menu", "/results", "/what-if"]

function AppShell() {
  const getInitialRoute = () => {
    const hash = window.location.hash.replace("#", "")
    return VALID_ROUTES.includes(hash) ? hash : "/"
  }

  const [currentRoute, setCurrentRoute] = React.useState(getInitialRoute)

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (VALID_ROUTES.includes(hash)) setCurrentRoute(hash)
    }
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const navigateTo = (route) => {
    // Anchor-only links (/#...) navigate to home and scroll; don't change route state
    if (route.startsWith("/#")) {
      const anchor = route.slice(2)
      if (currentRoute !== "/") {
        setCurrentRoute("/")
        window.location.hash = "/"
        // Give React a tick to render Home, then scroll
        setTimeout(() => {
          document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" })
        }, 120)
      } else {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" })
      }
      return
    }

    setCurrentRoute(route)
    window.location.hash = route
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const devRoutes = [
    { path: "/", label: "Home" },
    { path: "/event", label: "Event Setup" },
    { path: "/menu", label: "Menu Selection" },
    { path: "/results", label: "Results Dashboard" },
    { path: "/what-if", label: "What-If Simulator" },
  ]

  const renderPage = () => {
    switch (currentRoute) {
      case "/event":   return <EventSetup onNavigate={navigateTo} />
      case "/menu":    return <MenuSelection onNavigate={navigateTo} />
      case "/results": return <ResultsDashboard onNavigate={navigateTo} />
      case "/what-if": return <WhatIfSimulator onNavigate={navigateTo} />
      default:         return <Home onNavigate={navigateTo} />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header currentRoute={currentRoute} onNavigate={navigateTo} />

      <div className="flex-1">
        {renderPage()}
      </div>

      {/* Dev route switcher — evaluation helper */}
      <footer className="border-t border-border/60 bg-card/60 py-3 text-xs text-muted-foreground backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">CaterAI</span>
            <span>•</span>
            <span>Routes</span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {devRoutes.map((r) => (
              <button
                key={r.path}
                type="button"
                onClick={() => navigateTo(r.path)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  currentRoute === r.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
