import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export const editAccount = protectedProcedure
  .input(
    z.object({
      addedInterests: z.array(z.string()),
      addedSkills: z.array(z.string()),
      removedSkills: z.array(z.string()),
      removedInterests: z.array(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const { addedSkills, addedInterests, removedInterests, removedSkills } =
      input;

    await ctx.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        Skills: {
          connect: addedSkills.map((skill) => ({ id: skill })),
          disconnect: removedSkills.map((skill) => ({ id: skill })),
        },
        Interests: {
          connect: addedInterests.map((interest) => ({ id: interest })),
          disconnect: removedInterests.map((interest) => ({ id: interest })),
        },
      },
    });
    return { success: true };
  });
