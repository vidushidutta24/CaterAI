const { z } = require("zod");

const estimateRequestSchema = z
  .object({
    guests: z.number().int().positive("guests must be a positive integer greater than 0"),
    adults: z.number().int().min(0, "adults must be greater than or equal to 0"),
    children: z.number().int().min(0, "children must be greater than or equal to 0"),
    vegetarianPercentage: z
      .number()
      .min(0, "vegetarianPercentage must be between 0 and 100")
      .max(100, "vegetarianPercentage must be between 0 and 100"),
    nonVegetarianPercentage: z
      .number()
      .min(0, "nonVegetarianPercentage must be between 0 and 100")
      .max(100, "nonVegetarianPercentage must be between 0 and 100"),
    eventType: z.string().trim().min(1, "eventType is required"),
    meal: z.enum(["lunch", "dinner"], {
      errorMap: () => ({ message: "meal must be either 'lunch' or 'dinner'" })
    }),
    duration: z.number().positive("duration must be greater than 0"),
    season: z.string().trim().min(1, "season is required"),
    menu: z
      .array(z.string().trim().min(1))
      .nonempty("menu must be a non-empty array of dish identifiers")
  })
  .refine((data) => data.adults + data.children === data.guests, {
    message: "adults + children must equal total guests",
    path: ["guests"]
  })
  .refine(
    (data) =>
      Math.round(data.vegetarianPercentage + data.nonVegetarianPercentage) === 100,
    {
      message: "vegetarianPercentage + nonVegetarianPercentage must equal 100",
      path: ["vegetarianPercentage"]
    }
  );

function validateEstimateRequest(body) {
  const result = estimateRequestSchema.safeParse(body);
  if (!result.success) {
    const errorMessages = result.error.errors.map((e) => e.message).join("; ");
    return {
      isValid: false,
      error: errorMessages
    };
  }
  return {
    isValid: true,
    data: result.data
  };
}

module.exports = {
  estimateRequestSchema,
  validateEstimateRequest
};
