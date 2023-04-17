import { z } from "zod";

const zodReply = z
  .string()
  .trim()
  .min(3, { message: "Reply can't be too short" })
  .max(3000, { message: "Reply can't be too big" })
  .transform((text) => ({
    text: text.split(" ").filter((word) => word.length > 0),
    largeWords: text.split(" ").filter((word) => word.length > 40),
  }))
  .pipe(
    z.object({
      text: z
        .string()
        .array()
        .max(500, { message: "Reply can't have more than 500 words" })
        .min(1, { message: "Reply can't be empty" }),
      largeWords: z
        .string()
        .array()
        .max(0, { message: "A word can't be so long" }),
    })
  )
  .transform((obj) => obj.text.join(" "));

export default zodReply;
