import { z } from "zod";

export const zodName = z
  .string()
  .trim()
  .min(3, { message: "Name can't be too short" })
  .max(30, { message: "Name can't be too big" })
  .regex(/^[A-z. ]+$/, { message: "Your name seems invalid" })
  .transform((name) => name.split(" ").filter((word) => word.length > 0))
  .pipe(
    z
      .string()
      .array()
      .max(4, { message: "Name can't have more than 4 words" })
      .min(1, { message: "Name can't be empty" })
  )
  .transform((name) => name.join(" "));
