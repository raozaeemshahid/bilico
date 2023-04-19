import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteWork = protectedProcedure
  .input(z.object({ workId: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const work = await ctx.prisma.work.findUniqueOrThrow({
      where: {
        id: input.workId,
      },
      select: {
        userId: true,
      },
    });
    if (work.userId !== ctx.session.user.id)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You're not the author",
      });

    await ctx.prisma.work.delete({
      where: { id: input.workId },
    });
    return { success: true };
  });
