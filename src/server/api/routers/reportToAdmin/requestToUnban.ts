import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import PagesLinks from "../../../../lib/PagesLink";

export const requestToUnban = protectedProcedure
  .input(z.object({ message: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const previousReport = await ctx.prisma.reportToAdmin.findFirst({
      where: {
        type: "TO_UNBAN",
        reportedUserId: ctx.session.user.id,
      },
    });
    if (previousReport) return { alreadyReported: true };

    return ctx.prisma.reportToAdmin.create({
      data: {
        link: PagesLinks.getProfileLink(ctx.session.user.id),
        message: input.message,
        type: "TO_UNBAN",
        ReportedUser: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
  });
