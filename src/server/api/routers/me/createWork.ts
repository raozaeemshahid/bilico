import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import zodPost from "../../../../lib/zod/zodPost";

export const createWork = protectedProcedure
  .input(
    z.object({ workBody: zodPost })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.work.create({
      data: {
        Body: input.workBody,
        CreatedBy: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
    return { success: true };
  });
