import { z } from "zod";

const zodBio = z
  .string()
  .trim()
  .min(3, { message: "Your bio can't be so short" })
  .max(1000, { message: "Your bio can't be so long" })
  .transform((text) => ({
    text,
    largeWords: text.split(" ").filter((word) => word.length > 40),
  }))
  .pipe(
    z.object({
      text: z.string(),
      largeWords: z
        .string()
        .array()
        .max(0, { message: "A word can't be so long" }),
    })
  )
  .transform((obj) => obj.text);

export default zodBio
