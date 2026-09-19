import { z } from "zod"
import { VALID_DISH_IDS } from "../data/foodRules.js"

export const estimateRequestSchema = z
  .object({
    guests: z
      .number({ required_error: "guests is required" })
      .int("guests must be an integer")
      .positive("guests must be greater than 0"),
    adults: z
      .number({ required_error: "adults is required" })
      .int("adults must be an integer")
      .min(0, "adults cannot be negative"),
    children: z
      .number({ required_error: "children is required" })
      .int("children must be an integer")
      .min(0, "children cannot be negative"),
    vegetarianPercentage: z
      .number({ required_error: "vegetarianPercentage is required" })
      .min(0, "vegetarianPercentage must be between 0 and 100")
      .max(100, "vegetarianPercentage must be between 0 and 100"),
    nonVegetarianPercentage: z
      .number({ required_error: "nonVegetarianPercentage is required" })
      .min(0, "nonVegetarianPercentage must be between 0 and 100")
      .max(100, "nonVegetarianPercentage must be between 0 and 100"),
    eventType: z
      .string({ required_error: "eventType is required" })
      .trim()
      .min(1, "eventType cannot be empty"),
    meal: z.enum(["lunch", "dinner"], {
      required_error: "meal must be either 'lunch' or 'dinner'",
      invalid_type_error: "meal must be either 'lunch' or 'dinner'",
    }),
    duration: z
      .number({ required_error: "duration is required" })
      .positive("duration must be a positive number"),
    season: z
      .string({ required_error: "season is required" })
      .trim()
      .min(1, "season cannot be empty"),
    menu: z
      .array(z.string(), { required_error: "menu is required" })
      .min(1, "menu must contain at least one dish"),
  })
  .superRefine((data, ctx) => {
    // adults + children === guests
    if (data.adults + data.children !== data.guests) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `adults (${data.adults}) + children (${data.children}) must equal guests (${data.guests})`,
        path: ["guests"],
      })
    }

    // vegetarianPercentage + nonVegetarianPercentage === 100
    if (
      Math.round(data.vegetarianPercentage + data.nonVegetarianPercentage) !==
      100
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `vegetarianPercentage (${data.vegetarianPercentage}) + nonVegetarianPercentage (${data.nonVegetarianPercentage}) must total 100%`,
        path: ["vegetarianPercentage"],
      })
    }

    // Reject unknown dish IDs
    for (let i = 0; i < data.menu.length; i++) {
      const dishId = data.menu[i]
      if (!VALID_DISH_IDS.includes(dishId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown dish ID '${dishId}'. Must be one of: ${VALID_DISH_IDS.join(", ")}`,
          path: ["menu", i],
        })
      }
    }
  })

/**
 * Validates request payload.
 * Returns { success: true, data } or { success: false, error: string }
 */
export function validateEstimateRequest(body) {
  const result = estimateRequestSchema.safeParse(body)
  if (!result.success) {
    const firstError = result.error.errors[0]?.message || "Validation failed"
    return {
      success: false,
      error: firstError,
      details: result.error.format(),
    }
  }
  return {
    success: true,
    data: result.data,
  }
}
