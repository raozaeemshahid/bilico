import { z } from "zod";

const zodNote = z
  .string()
  .trim()
  .max(1000, { message: "Your note can't be so long" })
  .transform((note) => ({
    note,
    largeWords: note.split(" ").filter((word) => word.length > 40),
  }))
  .pipe(
    z.object({
      note: z.string(),
      largeWords: z
        .string()
        .array()
        .max(0, { message: "A word can't be so long" }),
    })
  )
  .transform((obj) => obj.note);

export default zodNote
