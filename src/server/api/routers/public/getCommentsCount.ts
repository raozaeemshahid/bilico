import { protectedProcedure } from "../../trpc";
import { CommentType } from "@prisma/client";
import { z } from "zod";

export const getCommentsCount = protectedProcedure
  .input(z.object({ postId: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const count: { [commentType: string]: number } = {};
    await Promise.all(
      Object.values(CommentType).map((commentType) =>
        ctx.prisma.comment
          .count({
            where: {
              postId: input.postId,
              CommentType: commentType,
            },
          })
          .then((data) => {
            count[commentType] = data;
          })
      )
    );
    return count;
  });
