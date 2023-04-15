import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import type { AllReactions } from "../../../../components/CommentsAndReactions/Reactions";

export const getReactions = protectedProcedure
  .input(
    z.object({
      postId: z.string().uuid(),
      reaction: z
        .union([
          z.literal<AllReactions>("All"),
          z.literal<AllReactions>("Agree"),
          z.literal<AllReactions>("Disagree"),
          z.literal<AllReactions>("Love"),
        ])
        .default("All"),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
    })
  )
  .query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.reactPost.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        postId: input.postId,
        ...(input.reaction !== "All"
          ? {
              Reaction: input.reaction,
            }
          : {}),
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        CreatedAt: "asc",
      },
      select: {
        id: true,
        Reaction: true,
        FromUser: {
          select: {
            id: true,
            name: true,
            image: true,
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
