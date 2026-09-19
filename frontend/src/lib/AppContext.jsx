import * as React from "react"

/* ─────────────────────────────────────────────
   Initial / default form state
───────────────────────────────────────────── */
export const INITIAL_EVENT = {
  eventType: "",
  eventDate: "",
  mealTime: "",
  season: "winter",
  guests: 500,
  adults: 420,
  children: 80,
  vegetarianPct: 70,
  nonVegetarianPct: 30,
  duration: "4",
}

const STORAGE_KEYS = {
  EVENT: "caterai_event_data",
  MENU: "caterai_selected_menu",
  RESULT: "caterai_plan_result",
}

function loadStored(key, fallback) {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err)
    return fallback
  }
}

function saveStored(key, value) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Failed to write ${key} to localStorage:`, err)
  }
}

const AppContext = React.createContext(null)

export function AppProvider({ children }) {
  const [eventData, setEventData] = React.useState(() =>
    loadStored(STORAGE_KEYS.EVENT, INITIAL_EVENT)
  )
  const [selectedMenu, setSelectedMenu] = React.useState(() =>
    loadStored(STORAGE_KEYS.MENU, [])
  )
  const [planResult, setPlanResult] = React.useState(() =>
    loadStored(STORAGE_KEYS.RESULT, null)
  )

  // Persist eventData changes
  React.useEffect(() => {
    saveStored(STORAGE_KEYS.EVENT, eventData)
  }, [eventData])

  // Persist selectedMenu changes
  React.useEffect(() => {
    saveStored(STORAGE_KEYS.MENU, selectedMenu)
  }, [selectedMenu])

  // Persist planResult changes
  React.useEffect(() => {
    saveStored(STORAGE_KEYS.RESULT, planResult)
  }, [planResult])

  const updateEventData = React.useCallback((updates) => {
    setEventData((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetEventData = React.useCallback(() => {
    setEventData(INITIAL_EVENT)
    setPlanResult(null)
    saveStored(STORAGE_KEYS.EVENT, INITIAL_EVENT)
    saveStored(STORAGE_KEYS.RESULT, null)
  }, [])

  const toggleDish = React.useCallback((dishId) => {
    setSelectedMenu((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    )
  }, [])

  const selectDishes = React.useCallback((dishIds) => {
    setSelectedMenu(dishIds)
  }, [])

  const clearMenu = React.useCallback(() => {
    setSelectedMenu([])
    setPlanResult(null)
    saveStored(STORAGE_KEYS.MENU, [])
    saveStored(STORAGE_KEYS.RESULT, null)
  }, [])

  const isDishSelected = React.useCallback(
    (dishId) => selectedMenu.includes(dishId),
    [selectedMenu]
  )

  const value = React.useMemo(
    () => ({
      eventData,
      updateEventData,
      resetEventData,
      selectedMenu,
      setSelectedMenu,
      toggleDish,
      selectDishes,
      clearMenu,
      isDishSelected,
      planResult,
      setPlanResult,
    }),
    [
      eventData,
      updateEventData,
      resetEventData,
      selectedMenu,
      toggleDish,
      selectDishes,
      clearMenu,
      isDishSelected,
      planResult,
      setPlanResult,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = React.useContext(AppContext)
  if (!ctx) {
    throw new Error("useAppContext must be used inside <AppProvider>")
  }
  return ctx
}
