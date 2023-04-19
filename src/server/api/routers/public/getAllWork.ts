import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import type { OrderOfDataByTime } from "../../../../lib/common/names";

export const getAllWork = protectedProcedure
  .input(
    z.object({
      userId: z.string().uuid().nullish(),
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
    const items = await ctx.prisma.work.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        userId: input.userId || ctx.session.user.id,
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        CreatedAt: input.order == "Newest" ? "desc" : "asc",
      },
      select: {
        id: true,
        Body: true,
        CreatedAt: true,
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
