import { protectedProcedure } from "../../trpc";

export const getAllInterestsAndSkills = protectedProcedure.query(
  async ({ ctx }) => {
    const interests = await ctx.prisma.interest.findMany();
    const skills = await ctx.prisma.skill.findMany();

    return {
      success: true,
      interests,
      skills,
    };
  }
);
