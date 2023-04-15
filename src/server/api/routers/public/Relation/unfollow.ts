import { protectedProcedure } from "../../../trpc";
import { z } from "zod";

export const unfollow = protectedProcedure
  .input(z.object({ otherUserId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    await Promise.all([
      ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { Follow: { disconnect: { id: input.otherUserId } } },
      }),
      ctx.prisma.user.update({
        where: { id: input.otherUserId },
        data: { FollowedBy: { disconnect: { id: ctx.session.user.id } } },
      }),
    ]);

    return { success: true };
  });
