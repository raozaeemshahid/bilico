import { protectedProcedure } from "../../trpc";

export const hasSeenConnectionRequests = protectedProcedure.mutation(
  async ({ ctx }) => {
    await ctx.prisma.connectionRequest.updateMany({
      data: {
        isSeen: true,
      },
      where: {
        receiverId: ctx.session.user.id,
        isSeen: false
      },
    });
    return { success: true };
  }
);
