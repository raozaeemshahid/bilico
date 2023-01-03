import { protectedProcedure } from "../../trpc";

export const DeactivateAccount = protectedProcedure.mutation(
  async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { isDeactivated: false },
    });
    return { success: true };
  }
);
