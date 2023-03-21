import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { CommentType } from "@prisma/client";

const ZReaction = z.union([
  z.literal(CommentType.Agree),
  z.literal(CommentType.Disagree),
  z.literal(CommentType.Appreciation),
  z.literal(CommentType.Opinion),
]);
export const createComment = protectedProcedure
  .input(
    z.object({
      commentType: ZReaction.nullish(),
      comment: z.string().min(1),
      postId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.comment.create({
      data: {
        Comment: input.comment,
        CommentType: input.commentType,
        CreatedBy: { connect: { id: ctx.session.user.id } },
        OnPost: { connect: { id: input.postId } },
      },
    });
  });
