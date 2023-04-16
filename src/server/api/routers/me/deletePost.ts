import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { deleteCommentsWithAllNestedReplies } from "../../../../lib/db_helperFunctions";

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
    const allComments = await ctx.prisma.comment.findMany({
      where: { postId: input.postId },
    });
    await Promise.all(
      allComments.map((comment) =>
        deleteCommentsWithAllNestedReplies(comment.id)
      )
    );
    await ctx.prisma.reactPost.deleteMany({ where: { postId: input.postId } });
    await ctx.prisma.post.delete({
      where: {
        id: input.postId,
      },
    });
    return { success: true };
  });
