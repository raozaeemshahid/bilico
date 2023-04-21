import PagesLinks from "../../../../lib/PagesLink";
import { protectedProcedure } from "../../trpc";

export const reactivateAccount = protectedProcedure.mutation(
  async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { isDeactivated: false },
    });
    await ctx.prisma.notification.create({
      data: {
        link: PagesLinks.ME,
        title: "Glad to see you back",
        ForUser: { connect: { id: ctx.session.user.id } },
        byUserId: ctx.session.user.id,
        byUserImage: ctx.session.user.image,
        byUserName: ctx.session.user.name,
      },
    });
    return { success: true };
  }
);
