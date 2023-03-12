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

export const zodBio = z
  .string()
  .trim()
  .min(3, { message: "Your bio can't be so short" })
  .max(1000, { message: "Your bio can't be so long" })
  .transform((bio) => ({
    bio,
    largeWords: bio.split(" ").filter((word) => word.length > 40),
  }))
  .pipe(
    z.object({
      bio: z.string(),
      largeWords: z
        .string()
        .array()
        .max(0, { message: "A word can't be so long" }),
    })
  )
  .transform((obj) => obj.bio);

export const zodPost = z
  .string()
  .trim()
  .min(3, { message: "Post can't be too short" })
  .max(5000, { message: "Post can't be too big" })
  .transform((name) => name.split(" ").filter((word) => word.length > 0))
  .pipe(
    z
      .string()
      .array()
      .max(1000, { message: "Post can't have more than 1000 words" })
      .min(1, { message: "Post can't be empty" })
  )
  .transform((name) => name.join(" "));
