import { z } from "zod";

const zodPost = z
  .string()
  .trim()
  .min(3, { message: "Post can't be too short" })
  .max(5000, { message: "Post can't be too big" })
  .transform((text) => ({
    text: text.split(" ").filter((word) => word.length > 0),
    largeWords: text.split(" ").filter((word) => word.length > 50),
  }))
  .pipe(
    z.object({
      text: z
        .string()
        .array()
        .max(1000 , { message: "Post can't have more than 500 words" })
        .min(1, { message: "Post can't be empty" }),
      largeWords: z
        .string()
        .array()
        .max(0, { message: "A word can't be so long" }),
    })
  )
  .transform((obj) => obj.text.join(" "));

export default zodPost 
