import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import PagesLinks from "../../../../../lib/PagesLink";

export const removeConnection = protectedProcedure
  .input(z.object({ otherUserId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    if (ctx.session.user.id == input.otherUserId)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Couldn't do operation to self",
      });
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        ConnectedTo: { disconnect: { id: input.otherUserId } },
        ConnectedWith: { disconnect: { id: input.otherUserId } },
        Follow: { disconnect: { id: input.otherUserId } },
      },
    });
    await ctx.prisma.notification
      .create({
        data: {
          link: PagesLinks.getProfileLink(ctx.session.user.id),
          title: `removed connection with you`,
          ForUser: { connect: { id: input.otherUserId } },
          byUserId: ctx.session.user.id,
          byUserImage: ctx.session.user.image,
          byUserName: ctx.session.user.name,
        },
      })
    return { success: true };
  });
