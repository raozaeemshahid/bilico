import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export const deleteComment = protectedProcedure
  .input(z.object({ commentId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.comment.delete({
      where: {
        id: input.commentId,
      },
    });
    return { success: true };
  });
