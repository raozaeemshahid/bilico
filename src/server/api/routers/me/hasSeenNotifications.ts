import { protectedProcedure } from "../../trpc";

export const hasSeenNotifications = protectedProcedure.mutation(
  async ({ ctx }) => {
    await ctx.prisma.notification.updateMany({
      data: {
        isSeen: true,
      },
      where: {
        userId: ctx.session.user.id,
        isSeen: false,
      },
    });
    return { success: true };
  }
);
