import { protectedProcedure } from "../../../trpc";
import { z } from "zod";

export const rejectRequest = protectedProcedure
  .input(z.object({ otherUserId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    await ctx.prisma.connectionRequest.deleteMany({
      where: { senderId: input.otherUserId, receiverId: ctx.session.user.id },
    });
    return { success: true };
  });
