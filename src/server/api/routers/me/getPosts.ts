import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import type { OrderOfDataByTime } from "../../../../lib/common/names";

export const getPosts = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
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
    const items = await ctx.prisma.post.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        userId: ctx.session.user.id,
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        CreateAt: input.order == "Newest" ? "desc" : "asc",
      },
      select: {
        _count: { select: { Comments: true, Reactions: true } },
        id: true,
        Body: true,
        CreateAt: true,
        Interests: { select: { title: true, id: true } },
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
