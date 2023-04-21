import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { CommentType } from "@prisma/client";
import zodComment from "../../../../lib/zod/zodComment";
import PagesLinks from "../../../../lib/PagesLink";

const ZReaction = z.union([
  z.literal(CommentType.Appreciation),
  z.literal(CommentType.Opinion),
  z.literal(CommentType.Question),
  z.literal(CommentType.Suggestion),
]);
export const createComment = protectedProcedure
  .input(
    z.object({
      commentType: ZReaction.nullish(),
      comment: zodComment,
      postId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const comment = await ctx.prisma.comment.create({
      data: {
        Comment: input.comment,
        CommentType: input.commentType,
        CreatedBy: { connect: { id: ctx.session.user.id } },
        OnPost: { connect: { id: input.postId } },
      },
      select: {
        id: true,
        OnPost: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (comment.OnPost && comment.OnPost.userId !== ctx.session.user.id) {
      await ctx.prisma.notification.create({
        data: {
          title: `${
            input.commentType == "Opinion"
              ? "gave a opinion on your post"
              : input.commentType == "Question"
              ? "asked a question on your post"
              : input.commentType == "Suggestion"
              ? "gave a suggestion on your post"
              : input.commentType == "Appreciation"
              ? "appreciated your post"
              : "commented on your post"
          }`,
          link: PagesLinks.getCommentLink(comment.id),
          byUserId: ctx.session.user.id,
          byUserImage: ctx.session.user.image,
          byUserName: ctx.session.user.name,
          ForUser: { connect: { id: comment.OnPost.userId } },
          subText: input.comment,
          Comment: { connect: { id: comment.id } },
        },
      });
    }
    return { success: true };
  });
