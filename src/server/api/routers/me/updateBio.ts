import { zodBio } from "../../../../lib/zod";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export const updateBio = protectedProcedure
  .input(z.object({ bio: zodBio }))
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { Bio: input.bio },
    });
    return { success: true };
  });
