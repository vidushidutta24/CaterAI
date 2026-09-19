/**
 * CaterAI Food Rules & Knowledge Base
 *
 * Prototype model baseline portion sizes and dish metadata.
 */

export const FOOD_RULES = {
  // Starters
  paneer_tikka: {
    id: "paneer_tikka",
    displayName: "Paneer Tikka",
    category: "Starters",
    unit: "kg",
    basePerPerson: 45, // grams per person
    vegetarian: true,
    foodType: "vegetarian",
  },
  veg_spring_roll: {
    id: "veg_spring_roll",
    displayName: "Veg Spring Roll",
    category: "Starters",
    unit: "kg",
    basePerPerson: 40, // grams per person
    vegetarian: true,
    foodType: "vegetarian",
  },
  chicken_tikka: {
    id: "chicken_tikka",
    displayName: "Chicken Tikka",
    category: "Starters",
    unit: "kg",
    basePerPerson: 50, // grams per person
    vegetarian: false,
    foodType: "non_vegetarian",
  },
  hara_bhara_kebab: {
    id: "hara_bhara_kebab",
    displayName: "Hara Bhara Kebab",
    category: "Starters",
    unit: "kg",
    basePerPerson: 45, // grams per person
    vegetarian: true,
    foodType: "vegetarian",
  },

  // Main Course
  shahi_paneer: {
    id: "shahi_paneer",
    displayName: "Shahi Paneer",
    category: "Main Course",
    unit: "kg",
    basePerPerson: 55, // grams per person
    vegetarian: true,
    foodType: "vegetarian",
  },
  butter_chicken: {
    id: "butter_chicken",
    displayName: "Butter Chicken",
    category: "Main Course",
    unit: "kg",
    basePerPerson: 55, // grams per person
    vegetarian: false,
    foodType: "non_vegetarian",
  },
  dal_makhani: {
    id: "dal_makhani",
    displayName: "Dal Makhani",
    category: "Main Course",
    unit: "kg",
    basePerPerson: 50, // grams per person
    vegetarian: true,
    foodType: "vegetarian",
  },
  biryani: {
    id: "biryani",
    displayName: "Dum Biryani",
    category: "Main Course",
    unit: "kg",
    basePerPerson: 100, // grams per person
    vegetarian: false,
    foodType: "neutral",
  },

  // Bread
  naan: {
    id: "naan",
    displayName: "Butter Naan",
    category: "Bread",
    unit: "pieces",
    basePerPerson: 1.3, // pieces per person
    vegetarian: true,
    foodType: "neutral",
  },
  roti: {
    id: "roti",
    displayName: "Tandoori Roti",
    category: "Bread",
    unit: "pieces",
    basePerPerson: 1.2, // pieces per person
    vegetarian: true,
    foodType: "neutral",
  },

  // Desserts
  gulab_jamun: {
    id: "gulab_jamun",
    displayName: "Gulab Jamun",
    category: "Desserts",
    unit: "pieces",
    basePerPerson: 0.8, // pieces per person
    vegetarian: true,
    foodType: "neutral",
  },
  rasmalai: {
    id: "rasmalai",
    displayName: "Rasmalai",
    category: "Desserts",
    unit: "pieces",
    basePerPerson: 0.7, // pieces per person
    vegetarian: true,
    foodType: "neutral",
  },
  ice_cream: {
    id: "ice_cream",
    displayName: "Ice Cream",
    category: "Desserts",
    unit: "litres",
    basePerPerson: 0.18, // litres per person
    vegetarian: true,
    foodType: "neutral",
  },

  // Drinks
  soft_drink: {
    id: "soft_drink",
    displayName: "Soft Drinks",
    category: "Drinks",
    unit: "litres",
    basePerPerson: 0.25, // litres per person
    vegetarian: true,
    foodType: "neutral",
  },
  fresh_juice: {
    id: "fresh_juice",
    displayName: "Fresh Juice",
    category: "Drinks",
    unit: "litres",
    basePerPerson: 0.23, // litres per person
    vegetarian: true,
    foodType: "neutral",
  },
}

export const VALID_DISH_IDS = Object.keys(FOOD_RULES)
