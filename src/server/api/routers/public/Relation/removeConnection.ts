import { protectedProcedure } from "../../../trpc";
import { z } from "zod";

export const removeConnection = protectedProcedure
  .input(z.object({ otherUserId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        ConnectedTo: { disconnect: { id: input.otherUserId } },
        ConnectedWith: { disconnect: { id: input.otherUserId } },
      },
    });
    return { success: true };
  });
