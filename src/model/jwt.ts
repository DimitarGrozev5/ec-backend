import zod from "zod";

export const JWTPayload = zod.object({
  userId: zod.number(),
  email: zod.string(),
  iat: zod.number(),
  exp: zod.number(),
});

export type JWTPayloadType = zod.infer<typeof JWTPayload>;
