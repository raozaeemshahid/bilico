import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const block = protectedProcedure
  .input(z.object({ otherUserId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.id == input.otherUserId)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Couldn't do operation to self",
      });
    await Promise.all([
      ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          Follow: { disconnect: { id: input.otherUserId } },
          FollowedBy: { disconnect: { id: input.otherUserId } },
          Trust: { disconnect: { id: input.otherUserId } },
          TrustedBy: { disconnect: { id: input.otherUserId } },
          ConnectedWith: { disconnect: { id: input.otherUserId } },
          ConnectedTo: { disconnect: { id: input.otherUserId } },
          Blocked: { connect: { id: input.otherUserId } },
        },
      }),
      ctx.prisma.connectionRequest.deleteMany({
        where: {
          OR: [
            { receiverId: input.otherUserId, senderId: ctx.session.user.id },
            { receiverId: ctx.session.user.id, senderId: input.otherUserId },
          ],
        },
      }),
    ]);
    return { success: true };
  });
