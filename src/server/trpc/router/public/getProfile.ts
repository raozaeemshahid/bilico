import { z } from "zod";
import { publicProcedure } from "../../trpc";

export const getProfile = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        _count: {
          select: {
            Follow: true,
            FollowedBy: true,
            Posts: true,
            Questions: true,
            Answers: true,
          },
        },
        name: true,
        DateOfBirth: true,
        Gender: true,
        image: true,
        isDeactivated: true,
        isVerified: true,
        Interests: {
          select: {
            title: true,
          },
        },
        Skills: {
          select: {
            title: true,
          },
        },
        ScheduledOfDeletion: true,
        BannedUntil: true,
      },
    });

    if (!user || user.BannedUntil || user.isDeactivated) {
      return { notFound: true };
    }
  });
