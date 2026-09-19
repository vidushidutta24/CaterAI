/**
 * CaterAI Menu Dataset
 * 
 * Categories:
 * - Starters
 * - Main Course
 * - Bread
 * - Desserts
 * - Drinks
 */

export const MENU_CATEGORIES = [
  "Starters",
  "Main Course",
  "Bread",
  "Desserts",
  "Drinks",
]

export const MENU_ITEMS = [
  /* ─────────────────────────────────────────────
     STARTERS (4 dishes)
  ───────────────────────────────────────────── */
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    category: "Starters",
    unit: "Pieces",
    shortDescription: "Char-grilled spiced cottage cheese with crisp bell peppers and mint chutney.",
    icon: "Flame",
    dietary: "veg",
    tag: "Popular Starter",
    accent: "from-amber-500/20 via-orange-500/15 to-transparent",
    iconColor: "text-amber-600 dark:text-amber-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.18) 0%, transparent 60%)",
  },
  {
    id: "veg-spring-roll",
    name: "Veg Spring Roll",
    category: "Starters",
    unit: "Pieces",
    shortDescription: "Crisp golden pastry rolls packed with wok-tossed seasoned vegetables.",
    icon: "Salad",
    dietary: "veg",
    tag: "Crispy Delight",
    accent: "from-emerald-500/20 via-teal-500/15 to-transparent",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.18) 0%, transparent 60%)",
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    category: "Starters",
    unit: "Pieces",
    shortDescription: "Succulent boneless chicken marinated in roasted tandoori spices & yogurt.",
    icon: "Drumstick",
    dietary: "non-veg",
    tag: "Tandoori Classic",
    accent: "from-red-500/20 via-orange-500/15 to-transparent",
    iconColor: "text-rose-600 dark:text-rose-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(244, 63, 94, 0.18) 0%, transparent 60%)",
  },
  {
    id: "hara-bhara-kebab",
    name: "Hara Bhara Kebab",
    category: "Starters",
    unit: "Pieces",
    shortDescription: "Pan-seared spiced patties made of spinach, tender green peas, and herbs.",
    icon: "Leaf",
    dietary: "veg",
    tag: "Herb Infused",
    accent: "from-green-500/20 via-emerald-500/15 to-transparent",
    iconColor: "text-green-600 dark:text-green-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(34, 197, 94, 0.18) 0%, transparent 60%)",
  },

  /* ─────────────────────────────────────────────
     MAIN COURSE (4 dishes)
  ───────────────────────────────────────────── */
  {
    id: "shahi-paneer",
    name: "Shahi Paneer",
    category: "Main Course",
    unit: "Portions",
    shortDescription: "Royal cottage cheese simmered in velvety cashew nut and tomato gravy.",
    icon: "UtensilsCrossed",
    dietary: "veg",
    tag: "Royal Feast",
    accent: "from-orange-500/20 via-amber-500/15 to-transparent",
    iconColor: "text-orange-600 dark:text-orange-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(249, 115, 22, 0.18) 0%, transparent 60%)",
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    category: "Main Course",
    unit: "Portions",
    shortDescription: "Smoked chicken morsels bathed in satin tomato gravy enriched with cream.",
    icon: "Flame",
    dietary: "non-veg",
    tag: "Crowd Favorite",
    accent: "from-rose-500/20 via-red-500/15 to-transparent",
    iconColor: "text-red-600 dark:text-red-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(239, 68, 68, 0.18) 0%, transparent 60%)",
  },
  {
    id: "dal-makhani",
    name: "Dal Makhani",
    category: "Main Course",
    unit: "Portions",
    shortDescription: "Whole black lentils slow-cooked overnight with churned white butter & cream.",
    icon: "Soup",
    dietary: "veg",
    tag: "Slow-Cooked",
    accent: "from-yellow-500/20 via-amber-600/15 to-transparent",
    iconColor: "text-amber-700 dark:text-amber-300",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(217, 119, 6, 0.18) 0%, transparent 60%)",
  },
  {
    id: "biryani",
    name: "Biryani",
    category: "Main Course",
    unit: "Portions",
    shortDescription: "Aromatic basmati rice layered with saffron, caramelised onions, and whole spices.",
    icon: "Sparkles",
    dietary: "veg",
    tag: "Signature Dish",
    accent: "from-amber-400/20 via-orange-400/15 to-transparent",
    iconColor: "text-amber-600 dark:text-amber-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.2) 0%, transparent 60%)",
  },

  /* ─────────────────────────────────────────────
     BREAD (2 dishes)
  ───────────────────────────────────────────── */
  {
    id: "naan",
    name: "Naan",
    category: "Bread",
    unit: "Pieces",
    shortDescription: "Clay-oven baked fluffy leavened bread brushed with melted butter.",
    icon: "Wheat",
    dietary: "veg",
    tag: "Tandoor Baked",
    accent: "from-amber-300/25 via-yellow-400/15 to-transparent",
    iconColor: "text-amber-700 dark:text-amber-300",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(251, 191, 36, 0.22) 0%, transparent 60%)",
  },
  {
    id: "roti",
    name: "Roti",
    category: "Bread",
    unit: "Pieces",
    shortDescription: "Healthy whole-wheat flatbread cooked hot on tandoor or tawa.",
    icon: "CircleDot",
    dietary: "veg",
    tag: "Whole Wheat",
    accent: "from-stone-400/20 via-amber-400/10 to-transparent",
    iconColor: "text-stone-600 dark:text-stone-300",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(168, 162, 158, 0.2) 0%, transparent 60%)",
  },

  /* ─────────────────────────────────────────────
     DESSERTS (3 dishes)
  ───────────────────────────────────────────── */
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    category: "Desserts",
    unit: "Pieces",
    shortDescription: "Warm reduced milk dumplings soaked in green cardamom rose water syrup.",
    icon: "Cake",
    dietary: "veg",
    tag: "Traditional Sweet",
    accent: "from-orange-500/20 via-pink-500/15 to-transparent",
    iconColor: "text-orange-600 dark:text-orange-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(234, 88, 12, 0.18) 0%, transparent 60%)",
  },
  {
    id: "ice-cream",
    name: "Ice Cream",
    category: "Desserts",
    unit: "Scoops",
    shortDescription: "Artisanal churned scoops in vanilla, mango alphonso, and royal pistachio.",
    icon: "IceCreamBowl",
    dietary: "veg",
    tag: "Chilled Treat",
    accent: "from-blue-400/20 via-indigo-400/15 to-transparent",
    iconColor: "text-sky-600 dark:text-sky-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(56, 189, 248, 0.18) 0%, transparent 60%)",
  },
  {
    id: "rasmalai",
    name: "Rasmalai",
    category: "Desserts",
    unit: "Pieces",
    shortDescription: "Delicate chenna cakes immersed in saffron and pistachio clotted milk.",
    icon: "Milk",
    dietary: "veg",
    tag: "Royal Dessert",
    accent: "from-yellow-400/20 via-rose-300/15 to-transparent",
    iconColor: "text-amber-600 dark:text-amber-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(250, 204, 21, 0.2) 0%, transparent 60%)",
  },

  /* ─────────────────────────────────────────────
     DRINKS (2 dishes)
  ───────────────────────────────────────────── */
  {
    id: "soft-drinks",
    name: "Soft Drinks",
    category: "Drinks",
    unit: "Liters",
    shortDescription: "Chilled carbonated sodas, tonic waters, and sparkling fruit mixers.",
    icon: "CupSoda",
    dietary: "veg",
    tag: "Chilled Cans",
    accent: "from-sky-500/20 via-indigo-500/15 to-transparent",
    iconColor: "text-sky-600 dark:text-sky-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(14, 165, 233, 0.18) 0%, transparent 60%)",
  },
  {
    id: "fresh-juice",
    name: "Fresh Juice",
    category: "Drinks",
    unit: "Liters",
    shortDescription: "Pure cold-pressed seasonal fruits including Valencia orange & watermelon mint.",
    icon: "Citrus",
    dietary: "veg",
    tag: "Cold-Pressed",
    accent: "from-orange-500/20 via-yellow-500/15 to-transparent",
    iconColor: "text-amber-600 dark:text-amber-400",
    bgPattern: "radial-gradient(circle at 75% 25%, rgba(249, 115, 22, 0.2) 0%, transparent 60%)",
  },
]

/**
 * Sensible demo combination for popular wedding menu
 */
export const POPULAR_WEDDING_DISH_IDS = [
  "paneer-tikka",
  "chicken-tikka",
  "shahi-paneer",
  "butter-chicken",
  "dal-makhani",
  "biryani",
  "naan",
  "roti",
  "gulab-jamun",
  "fresh-juice",
]
