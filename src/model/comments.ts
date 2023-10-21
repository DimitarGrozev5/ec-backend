import zod from "zod";

// Post comment
export const commentPost_Schema = zod.object({
  byUser: zod.coerce.number(),
  forPhoto: zod.coerce.number(),
  text: zod.string().min(1),
});

export type CommentPostData = zod.infer<typeof commentPost_Schema>;
