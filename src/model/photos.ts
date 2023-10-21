import zod from "zod";

// Get photos
export const photoGetQueryParams_Schema = zod.object({
  limit: zod.coerce
    .number()
    .min(1, "Limit is too small!")
    .max(100, "Limit is too big!")
    .optional(),
  order: zod.union([zod.literal("asc"), zod.literal("desc")]).optional(),
  page: zod.coerce.number().min(1, "Page is too small!").optional(),
  orderBy: zod.literal("createdOn").optional(),
});

export type PhotoGetQueryParams = zod.infer<typeof photoGetQueryParams_Schema>;
