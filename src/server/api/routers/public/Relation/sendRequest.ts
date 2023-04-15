import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const sendRequest = protectedProcedure
  .input(z.object({ receiverId: z.string().uuid(), message: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const request = await ctx.prisma.connectionRequest.findFirst({
      where: {
        senderId: ctx.session.user.id,
        receiverId: input.receiverId,
      },
    });
    if (request)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Already Requested",
      });

    await Promise.all([
      ctx.prisma.connectionRequest.create({
        data: {
          Receiver: { connect: { id: input.receiverId } },
          Sender: { connect: { id: ctx.session.user.id } },
          message: input.message,
        },
      }),
      ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          Follow: {
            connect: {
              id: input.receiverId,
            },
          },
        },
      }),
    ]);
    return { success: true };
  });