import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import type { Interest, Skill } from "@prisma/client";

export const getAllInterestsAndSkills = protectedProcedure
  .input(
    z
      .object({
        includeSkill: z.boolean().default(true),
        includeInterests: z.boolean().default(true),
      })
      .nullish()
  )
  .query(async ({ ctx, input }) => {
    const interests: Interest[] =
      input && input.includeInterests
        ? await ctx.prisma.interest.findMany()
        : [];
    const skills: Skill[] =
      input && input.includeSkill ? await ctx.prisma.skill.findMany() : [];

    return {
      success: true,
      interests,
      skills,
    };
  });
