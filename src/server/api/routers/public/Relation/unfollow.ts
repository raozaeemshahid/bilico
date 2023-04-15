import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const unfollow = protectedProcedure
  .input(z.object({ otherUserId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.id == input.otherUserId)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Couldn't do operation to self",
      });
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
