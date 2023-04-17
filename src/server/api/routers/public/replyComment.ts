import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import zodReply from "../../../../lib/zod/zodReply";

export const replyComment = protectedProcedure
  .input(
    z.object({
      replyToCommentId: z.string().uuid(),
      comment: zodReply,
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.comment.create({
      data: {
        Comment: input.comment,
        ReplyTo: {
          connect: { id: input.replyToCommentId },
        },
        CreatedBy: { connect: { id: ctx.session.user.id } },
      },
    });
  });
