import zod from "zod";

// Update user
export const userUpdate_Schema = zod.object({
  email: zod.string().email("Email is invalid!").optional(),
  oldPassword: zod.string().min(6, "Password is too short!").optional(),
  newPassword: zod.string().min(6, "Password is too short!").optional(),
});

export type UserUpdateData = zod.infer<typeof userUpdate_Schema>;

// Get users
export const userGetQueryParams_Schema = zod.object({
  limit: zod.coerce
    .number()
    .min(1, "Limit is too small!")
    .max(100, "Limit is too big!")
    .optional(),
  order: zod.union([zod.literal("asc"), zod.literal("desc")]).optional(),
  page: zod.coerce.number().min(1, "Page is too small!").optional(),
  orderBy: zod
    .union([zod.literal("createdOn"), zod.literal("photosCount")])
    .optional(),
});

export type UserGetQueryParams = zod.infer<typeof userGetQueryParams_Schema>;

// Login
export const userLogin_Schema = zod.object({
  email: zod.string({
    required_error: "Email is required",
  }),
  password: zod.string({
    required_error: "Password is required",
  }),
});

export type UserLoginData = zod.infer<typeof userLogin_Schema>;

// Register
export const userRegister_Schema = zod.object({
  email: zod
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is invalid",
    })
    .email("Email is invalid!"),
  password: zod
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password is invalid",
    })
    .min(6, "Password is too short!"),
});

export type UserRegisterData = zod.infer<typeof userRegister_Schema>;
