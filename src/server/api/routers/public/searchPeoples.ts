import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const searchPeoples = protectedProcedure
  .input(
    z.object({
      searchKeywords: z.string(),
      requiredSkills: z.array(z.string()),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
    })
  )
  .query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50;
    const { cursor } = input;

    console.log(input.requiredSkills);
    const items = await ctx.prisma.user.findMany({
      take: limit + 1, // get an extra item at the end which we'll use as next cursor
      where: {
        BannedUntil: null || undefined,
        isDeactivated: false,
        
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
      cursor: cursor ? { id: cursor } : undefined,
      // orderBy: {
      //   createdAt: "desc",
      // },
      select: {
        id: true,
        name: true,
        image: true,
        Skills: true,
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
