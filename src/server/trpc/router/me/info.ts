import moment from "moment";
import { unbanUser } from "../../../../lib/db_helperFunctions";
import { isAlreadyPast } from "../../../../lib/helperFunctions";
import { protectedProcedure } from "../../trpc";

export const info = protectedProcedure.query(async ({ ctx }) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
    select: {
      _count: {
        select: {
          ConnectionRequestsReceive: {
            where: {
              isSeen: { equals: false },
            },
          },
          MessagesReceive: { where: { isSeen: { equals: false } } },
          Notifications: { where: { isSeen: { equals: false } } },
        },
      },
      emailVerified: true,
      isDeactivated: true,
      BannedUntil: true,
    },
  });

  if (!user) return { notFound: true };
  if (user.BannedUntil) {
    if (isAlreadyPast(moment(user.BannedUntil))) {
      await unbanUser(ctx.session.user.id);
    } else return { banned: true };
  }
  if (user.isDeactivated) return { deactivated: true };
  if (!user.emailVerified) return { notRegistered: true };

  return {
    success: true,
    newNotifications: user._count.Notifications,
    newMessages: user._count.MessagesReceive,
    newRequests: user._count.ConnectionRequestsReceive,
  };
});
