import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import type { ProfileNumbersListTexts } from "../../../../components/Me/Profile";

export const getList = protectedProcedure
  .input(
    z.object({
      list: z.union([
        z.literal<ProfileNumbersListTexts>("Connections"),
        z.literal<ProfileNumbersListTexts>("Followers"),
        z.literal<ProfileNumbersListTexts>("Trusts"),
        z.literal<ProfileNumbersListTexts>("Trusted"),
        z.literal<ProfileNumbersListTexts>("Following"),
      ]),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
    })
  )
  .query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const items = await ctx.prisma.user.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        ...(input.list == "Connections"
          ? {
              OR: [
                { ConnectedTo: { some: { id: ctx.session.user.id } } },
                { ConnectedWith: { some: { id: ctx.session.user.id } } },
              ],
            }
          : {}),
        ...(input.list == "Following"
          ? {
              FollowedBy: { some: { id: ctx.session.user.id } },
            }
          : {}),
        ...(input.list == "Followers"
          ? {
               Follow: { some: { id: ctx.session.user.id } },
            }
          : {}),
        ...(input.list == "Trusted"
          ? {
              Trust: { some: { id: ctx.session.user.id } },
            }
          : {}),
        ...(input.list == "Trusts"
          ? {
              TrustedBy: { some: { id: ctx.session.user.id } },
            }
          : {}),
      },
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        image: true,
        isVerified: true,
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
