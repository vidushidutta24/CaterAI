// Predefined food estimation rules and metadata for hackathon demo
const FOOD_RULES = {
  paneer_tikka: {
    name: "Paneer Tikka",
    category: "starter",
    unit: "kg",
    basePerPerson: 0.04,
    vegetarian: true
  },
  veg_spring_roll: {
    name: "Veg Spring Roll",
    category: "starter",
    unit: "pieces",
    basePerPerson: 2,
    vegetarian: true
  },
  chicken_tikka: {
    name: "Chicken Tikka",
    category: "starter",
    unit: "kg",
    basePerPerson: 0.06,
    vegetarian: false
  },
  hara_bhara_kebab: {
    name: "Hara Bhara Kebab",
    category: "starter",
    unit: "pieces",
    basePerPerson: 2,
    vegetarian: true
  },
  shahi_paneer: {
    name: "Shahi Paneer",
    category: "main",
    unit: "kg",
    basePerPerson: 0.08,
    vegetarian: true
  },
  butter_chicken: {
    name: "Butter Chicken",
    category: "main",
    unit: "kg",
    basePerPerson: 0.1,
    vegetarian: false
  },
  dal_makhani: {
    name: "Dal Makhani",
    category: "main",
    unit: "kg",
    basePerPerson: 0.07,
    vegetarian: true
  },
  biryani: {
    name: "Biryani",
    category: "main",
    unit: "kg",
    basePerPerson: 0.12,
    vegetarian: true // Can be eaten by all unless non-veg, but treated as universal main
  },
  naan: {
    name: "Naan",
    category: "bread",
    unit: "pieces",
    basePerPerson: 2,
    vegetarian: true
  },
  roti: {
    name: "Roti",
    category: "bread",
    unit: "pieces",
    basePerPerson: 2,
    vegetarian: true
  },
  gulab_jamun: {
    name: "Gulab Jamun",
    category: "dessert",
    unit: "pieces",
    basePerPerson: 2,
    vegetarian: true
  },
  rasmalai: {
    name: "Rasmalai",
    category: "dessert",
    unit: "pieces",
    basePerPerson: 2,
    vegetarian: true
  },
  ice_cream: {
    name: "Ice Cream",
    category: "dessert",
    unit: "cups",
    basePerPerson: 1,
    vegetarian: true
  },
  soft_drink: {
    name: "Soft Drink",
    category: "beverage",
    unit: "liters",
    basePerPerson: 0.25,
    vegetarian: true
  },
  fresh_juice: {
    name: "Fresh Juice",
    category: "beverage",
    unit: "liters",
    basePerPerson: 0.2,
    vegetarian: true
  }
};

const ESTIMATION_FACTORS = {
  childFactor: 0.65,
  mealFactors: {
    lunch: 0.95,
    dinner: 1.05
  },
  seasonFactors: {
    winter: 1.05,
    summer: 0.98,
    monsoon: 1.0,
    spring: 1.0
  },
  eventTypeFactors: {
    wedding: 1.05,
    corporate: 0.95,
    birthday: 0.95,
    casual: 1.0
  },
  standardBuffer: 1.05 // 5% buffer to prevent shortages
};

module.exports = {
  FOOD_RULES,
  ESTIMATION_FACTORS
};
