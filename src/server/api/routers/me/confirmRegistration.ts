import { protectedProcedure } from "../../trpc";
import { prisma } from "../../../db";
import { z } from "zod";
import { countries } from "countries-list";
import { TRPCError } from "@trpc/server";
import moment from "moment";
import { MINIMUM_AGE_REQUIREMENT } from "../../../../components/Register/DateOfBirth";
import zodName from "../../../../lib/zod/zodName";
import PagesLinks from "../../../../lib/PagesLink";

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
    if (
      moment.utc().diff(moment(input.dateOfBirth), "year", false) <
      MINIMUM_AGE_REQUIREMENT
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `You have to be atleast ${MINIMUM_AGE_REQUIREMENT} years old`,
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        emailVerified: new Date(),
        name: input.name,
        Gender: input.gender,
        Country: input.country,
        DateOfBirth: input.dateOfBirth,
      },
    });

    await ctx.prisma.notification.create({
      data: {
        link: PagesLinks.ME,
        title: "Welcome to Bilico - A Social Media for Professionals",
        ForUser: { connect: { id: ctx.session.user.id } },
        byUserId: ctx.session.user.id,
        byUserImage: ctx.session.user.image,
        byUserName: ctx.session.user.name,
      },
    });

    return { success: true, name: updatedUser.name };
  });
