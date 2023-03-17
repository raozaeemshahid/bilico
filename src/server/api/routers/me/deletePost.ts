import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export const DeletePost = protectedProcedure
  .input(z.object({ postId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.post.update({
      where: { id: input.postId },
      data: {
        Comments: {
          deleteMany: {},
        },
        Reactions: {
          deleteMany: {},
        },
      },
    });
    await ctx.prisma.post.delete({
      where: {
        id: input.postId,
      },
    });
    return { success: true };
  });
