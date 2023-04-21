import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Reaction } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const ZReaction = z.union([
  z.literal(Reaction.Agree),
  z.literal(Reaction.Disagree),
  z.literal(Reaction.Love),
]);
export const reactPost = protectedProcedure
  .input(
    z.object({
      reaction: ZReaction.nullish(),
      postId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (!input.reaction) {
      await ctx.prisma.reactPost.deleteMany({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      return;
    }
    const previousReaction = await ctx.prisma.reactPost.findFirst({
      where: { postId: input.postId, userId: ctx.session.user.id },
    });
    if (!previousReaction) {
      return ctx.prisma.reactPost.create({
        data: {
          Reaction: input.reaction,
          FromUser: { connect: { id: ctx.session.user.id } },
          ToPost: { connect: { id: input.postId } },
        },
        select: {
          Reaction: true,
        },
      });
    }
    return ctx.prisma.reactPost.update({
      where: { id: previousReaction.id },
      data: {
        Reaction: input.reaction,
      },
      select: {
        Reaction: true,
      },
    });
  });
