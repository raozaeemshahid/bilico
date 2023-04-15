import { protectedProcedure } from "../../../trpc";
import { z } from "zod";

export const removeTrust = protectedProcedure
  .input(z.object({ otherUserId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { Trust: { disconnect: { id: input.otherUserId } } },
    });
    return { success: true };
  });
