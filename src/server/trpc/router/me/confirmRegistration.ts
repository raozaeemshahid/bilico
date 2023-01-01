import { protectedProcedure } from "../../trpc";
import { prisma } from "../../../db/client";
import { z } from "zod";
import { zodName } from "../../../../lib/zod";
import { countries } from "countries-list";
import { TRPCError } from "@trpc/server";

export const countriesNamesList = Object.values(countries)
  .map((country) => country.name)
  .sort();

export const confirmRegistration = protectedProcedure
  .input(
    z.object({
      name: zodName,
      gender: z.union([
        z.literal("Male"),
        z.literal("Female"),
        z.literal("Other"),
      ]),
      dateOfBirth: z.string().datetime(),
      country: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        emailVerified: true,
      },
    });
    if (!user) return { userNotFound: true };
    if (user.emailVerified) return { alreadyRegistered: true };
    const country = countriesNamesList.find(
      (country) => country == input.country
    );
    if (!country)
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Country" });
    await prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        emailVerified: new Date(),
        name: input.name,
        Gender:
          (input.gender == "Male" ? "MALE" : undefined) ||
          (input.gender == "Female" ? "FEMALE" : undefined) ||
          (input.gender === "Other" ? "OTHER" : undefined) ||
          "RATHER_NOT_TO_SAY",
        Country: input.country,
        DateOfBirth: input.dateOfBirth,
      },
    });
    return { success: true };
  });
