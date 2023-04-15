import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const rejectRequest = protectedProcedure
  .input(z.object({ otherUserId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.id == input.otherUserId)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Couldn't do operation to self",
      });
    await ctx.prisma.connectionRequest.deleteMany({
      where: { senderId: input.otherUserId, receiverId: ctx.session.user.id },
    });
    return { success: true };
  });
