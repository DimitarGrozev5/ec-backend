import zod from "zod";

// Post contactMsgs
export const contactMsgPost_Schema = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  message: zod.string(),
});

export type ContactMsgPostData = zod.infer<typeof contactMsgPost_Schema>;
