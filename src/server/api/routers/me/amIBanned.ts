import moment from "moment";
import { unbanUser } from "../../../../lib/db_helperFunctions";
import { protectedProcedure } from "../../trpc";
import { isAlreadyPast } from "../../../../lib/helperFunctions";

export const amIBanned = protectedProcedure.query(async ({ ctx }) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
    select: {
      BannedUntil: true,
      ReasonOfBanned: true,
      GetReported: {
        where: {
          type: "TO_UNBAN",
        },
      },
    },
  });
  if (!user) return { userNotFound: true };
  if (!user.BannedUntil) return { notBanned: true };

  if (isAlreadyPast(moment(user.BannedUntil))) {
    await unbanUser(ctx.session.user.id);
    return { notBanned: true };
  }

  return {
    isBanned: true,
    reason: user.ReasonOfBanned,
    bannedUntil: user.BannedUntil,
    eligibleToApply: user.GetReported.length == 0,
  };
});
