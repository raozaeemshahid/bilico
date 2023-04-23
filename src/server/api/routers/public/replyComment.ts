import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import zodReply from "../../../../lib/zod/zodReply";
import PagesLinks from "../../../../lib/PagesLink";

export const replyComment = protectedProcedure
  .input(
    z.object({
      replyToCommentId: z.string().uuid(),
      comment: zodReply,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const comment = await ctx.prisma.comment.create({
      data: {
        Comment: input.comment,
        ReplyTo: {
          connect: { id: input.replyToCommentId },
        },
        CreatedBy: { connect: { id: ctx.session.user.id } },
      },
      select: {
        id: true,
        ReplyTo: {
          select: {
            CommenterUserId: true,
          },
        },
      },
    });

    void (async () => {
      if (
        comment.ReplyTo &&
        comment.ReplyTo.CommenterUserId !== ctx.session.user.id
      ) {
        await ctx.prisma.notification.create({
          data: {
            title: `replied to your comment`,
            link: PagesLinks.getCommentLink(comment.id),
            byUserId: ctx.session.user.id,
            byUserImage: ctx.session.user.image,
            byUserName: ctx.session.user.name,
            ForUser: { connect: { id: comment.ReplyTo.CommenterUserId } },
            subText: input.comment,
            Comment: { connect: { id: comment.id } },
          },
        });
      }
    })();

    return { success: true };
  });
