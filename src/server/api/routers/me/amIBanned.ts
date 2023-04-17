import moment from "moment";
import { protectedProcedure } from "../../trpc";
import { isAlreadyPast } from "../../../../lib/helperFunctions";
import { unbanUser } from "../../../../lib/db_helperfunctions/unbanUser";

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
