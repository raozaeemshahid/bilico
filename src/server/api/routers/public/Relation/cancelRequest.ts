import { protectedProcedure } from "../../../trpc";
import { z } from "zod";

export const cancelRequest = protectedProcedure
  .input(z.object({ otherUserId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    await ctx.prisma.connectionRequest.deleteMany({
      where: { senderId: ctx.session.user.id, receiverId: input.otherUserId },
    });
    return { success: true };
  });
