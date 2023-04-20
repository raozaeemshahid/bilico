import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import type { OrderOfDataByTime } from "../../../../lib/common/names";
import type { CommentType } from "@prisma/client";

export type AllCommentType = CommentType | "All" | "Reply";

export const getCommentsActivity = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      filter: z
        .union([
          z.literal<AllCommentType>("All"),
          z.literal<AllCommentType>("Opinion"),
          z.literal<AllCommentType>("Appreciation"),
          z.literal<AllCommentType>("Question"),
          z.literal<AllCommentType>("Suggestion"),
          z.literal<AllCommentType>("Reply"),
        ])
        .default("All"),
      order: z
        .union([
          z.literal<OrderOfDataByTime>("Newest"),
          z.literal<OrderOfDataByTime>("Oldest"),
        ])
        .default("Newest"),
    })
  )
  .query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.comment.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        CommenterUserId: ctx.session.user.id,

        ...(input.filter !== "All" && input.filter !== "Reply"
          ? {
              CommentType: input.filter,
            }
          : {}),
        ...(input.filter === "Reply"
          ? {
              replyToCommentId: { not: null },
            }
          : {}),
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        CreatedAt: input.order == "Newest" ? "desc" : "asc",
      },
      select: {
        id: true,
        Comment: true,
        CreatedAt: true,
        CommentType: true,
        postId: true,
        replyToCommentId: true,
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
