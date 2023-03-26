import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const DeletePost = protectedProcedure
  .input(z.object({ postId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUniqueOrThrow({
      where: {
        id: input.postId,
      },
      select: {
        userId: true,
      },
    });
    if (post.userId !== ctx.session.user.id)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You're not the author of post",
      });
    await ctx.prisma.post.delete({
      where: {
        id: input.postId,
      },
    });
    return { success: true };
  });
