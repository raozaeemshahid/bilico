import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import type { CommentType } from "@prisma/client";
import type { OrderOfDataByTime } from "../../../../lib/common/names";

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
      order: z
        .union([
          z.literal<OrderOfDataByTime>("Newest"),
          z.literal<OrderOfDataByTime>("Oldest"),
        ])
        .default("Newest"),
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
        CreatedAt: input.order == "Newest" ? "desc" : "asc",
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
      nextCursor = nextItem?.id ?? undefined;
    }

    return {
      items,
      nextCursor,
    };
  });
