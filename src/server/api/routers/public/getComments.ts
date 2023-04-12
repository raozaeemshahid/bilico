import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { CommentType } from "@prisma/client";

export const getComments = protectedProcedure
  .input(
    z.object({
      postId: z.string().uuid(),
      commentType: z
        .union([
          z.literal<CommentType>("Appreciation"),
          z.literal<CommentType>("Opinion"),
          z.literal<CommentType>("Question"),
          z.literal<CommentType>("Suggestion"),
        ])
        .default("Appreciation"),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
    })
  )
  .query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.comment.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        postId: input.postId,
        CommentType: input.commentType,
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        CreatedAt: "asc",
      },
      select: {
        id: true,
        Comment: true,
        CreatedAt: true,
        LovedByAuthor: true,
        _count: { select: { Replies: true } },
        CreatedBy: {
          select: {
            image: true,
            name: true,
            id: true,
            isVerified: true,
          },
        },
      },
    });
    let nextCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem!.id;
    }

    return {
      items,
      nextCursor,
    };
  });
