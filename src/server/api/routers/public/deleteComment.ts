import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { deleteCommentWithAllNestedReplies } from "../../../../lib/db_helperfunctions/deleteComment";

export const deleteComment = protectedProcedure
  .input(z.object({ commentId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const comment = await ctx.prisma.comment.findUniqueOrThrow({
      where: {
        id: input.commentId,
      },
      select: {
        CommenterUserId: true,
      },
    });
    if (comment.CommenterUserId !== ctx.session.user.id)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You're not the author of comment",
      });

    await deleteCommentWithAllNestedReplies(input.commentId);

    return { success: true };
  });
