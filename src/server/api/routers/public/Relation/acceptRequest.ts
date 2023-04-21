import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import PagesLinks from "../../../../../lib/PagesLink";

export const acceptRequest = protectedProcedure
  .input(z.object({ senderId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.id == input.senderId)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Couldn't do operation to self",
      });
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

    await ctx.prisma.notification
      .create({
        data: {
          link: PagesLinks.getProfileLink(ctx.session.user.id),
          title: `accepted your connection request`,
          ForUser: { connect: { id: input.senderId } },
          byUserId: ctx.session.user.id,
          byUserImage: ctx.session.user.image,
          byUserName: ctx.session.user.name,
        },
      })
    await Promise.all([
      ctx.prisma.connectionRequest.delete({ where: { id: request.id } }),
      ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ConnectedWith: { connect: { id: input.senderId } },
          Follow: { connect: { id: input.senderId } },
        },
      }),
    ]);
    return { success: true };
  });
