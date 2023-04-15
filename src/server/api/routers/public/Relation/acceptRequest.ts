import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const acceptRequest = protectedProcedure
  .input(z.object({ senderId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    const request = await ctx.prisma.connectionRequest.findFirst({
      where: {
        senderId: input.senderId,
        receiverId: ctx.session.user.id,
      },
    });
    if (!request)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No request found, unable to accept",
      });

    await ctx.prisma.connectionRequest.delete({ where: { id: request.id } });
    await ctx.prisma.user.update({
      where: { id: input.senderId },
      data: { ConnectedTo: { connect: { id: ctx.session.user.id } } },
    });
    return { success: true };
  });
