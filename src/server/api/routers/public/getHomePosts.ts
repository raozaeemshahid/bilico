import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import type { PostsInTab } from "../../../../components/Home/Home";

export const getHomePosts = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      postsIn: z.union([
        z.literal<PostsInTab>("Public"),
        z.literal<PostsInTab>("Following"),
      ]),
    })
  )
  .query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.post.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        ...(input.postsIn == "Following"
          ? {
              CreatedBy: {
                FollowedBy: {
                  some: { id: ctx.session.user.id },
                },
              },
            }
          : {}),
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        CreatedAt: "desc",
      },
      select: {
        _count: { select: { Comments: true, Reactions: true } },
        id: true,
        Body: true,
        CreatedAt: true,
        Interests: { select: { title: true, id: true } },
        Reactions: {
          where: { userId: ctx.session.user.id },
          select: { Reaction: true, id: true },
        },
        CreatedBy: {
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
