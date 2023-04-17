import { z } from "zod";

const zodComment = z
  .string()
  .trim()
  .min(3, { message: "Comment can't be too short" })
  .max(5000, { message: "Comment can't be too big" })
  .transform((text) => ({
    text: text.split(" ").filter((word) => word.length > 0),
    largeWords: text.split(" ").filter((word) => word.length > 40),
  }))
  .pipe(
    z.object({
      text: z
        .string()
        .array()
        .max(1000, { message: "Comment can't have more than 500 words" })
        .min(1, { message: "Comment can't be empty" }),
      largeWords: z
        .string()
        .array()
        .max(0, { message: "A word can't be so long" }),
    })
  )
  .transform((obj) => obj.text.join(" "));

export default zodComment;
