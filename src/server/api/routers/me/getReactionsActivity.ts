import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import type { OrderOfDataByTime } from "../../../../lib/common/names";
import { AllReactions } from "../../../../components/CommentsAndReactions/Reactions";

export const getReactionsActivity = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      filter: z
        .union([
          z.literal<AllReactions>("All"),
          z.literal<AllReactions>("Agree"),
          z.literal<AllReactions>("Disagree"),
          z.literal<AllReactions>("Love"),
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
    const items = await ctx.prisma.reactPost.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        userId: ctx.session.user.id,
        ...(input.filter !== "All"
          ? {
              Reaction: input.filter,
            }
          : {}),
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        CreatedAt: input.order == "Newest" ? "desc" : "asc",
      },
      select: {
        id: true,
        CreatedAt: true,
        Reaction: true,
        ToPost: {
          select: {
            Body: true,
            id: true,
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
