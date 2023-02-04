import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export const updateBio = protectedProcedure
  .input(z.object({ bio: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { Bio: input.bio },
    });
    return { success: true };
  });
