import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { deleteCommentsWithAllNestedReplies } from "../../../../lib/db_helperFunctions";

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

    await deleteCommentsWithAllNestedReplies(input.commentId);

    return { success: true };
  });
