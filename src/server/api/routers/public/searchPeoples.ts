import { z } from "zod";
import { SearchInTab } from "../../../../components/Peoples/SearchBox";
import { protectedProcedure } from "../../trpc";

export const searchPeoples = protectedProcedure
  .input(
    z.object({
      searchKeywords: z.string().max(30),
      requiredSkills: z.array(z.string()),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      searchIn: z.union([
        z.literal<SearchInTab>("All"),
        z.literal<SearchInTab>("Connections"),
        z.literal<SearchInTab>("Trusted"),
      ]),
    })
  )
  .query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;

    const items = await ctx.prisma.user.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        BannedUntil: null,
        isDeactivated: false,
        emailVerified: { not: null },

        ...(input.searchIn == "Connections"
          ? {
              OR: [
                { ConnectedTo: { some: { id: ctx.session.user.id } } },
                { ConnectedWith: { some: { id: ctx.session.user.id } } },
              ],
            }
          : {}),
        ...(input.searchIn == "Trusted"
          ? {
              TrustedBy: { some: { id: ctx.session.user.id } },
            }
          : {}),
        ...(input.searchKeywords.length > 0
          ? { name: { contains: input.searchKeywords } }
          : {}),

        ...(input.requiredSkills.length > 0
          ? {
              AND: input.requiredSkills.map((skill) => ({
                Skills: { some: { id: skill } },
              })),
            }
          : {}),
      },
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        image: true,
        Skills: true,
        Bio: true,
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
