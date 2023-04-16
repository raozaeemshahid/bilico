import { protectedProcedure } from "../../trpc";

export const deactivateAccount = protectedProcedure.mutation(
  async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { isDeactivated: true },
    });
    return { success: true };
  }
);
