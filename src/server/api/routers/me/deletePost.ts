import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { deletePostCompletely } from "../../../../lib/db_helperfunctions/deletePost";

export const deletePost = protectedProcedure
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
    await deletePostCompletely(input.postId);
    return { success: true };
  });
