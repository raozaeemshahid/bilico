import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { Reaction } from "@prisma/client";

const ZReaction = z.union([
  z.literal(Reaction.Agree),
  z.literal(Reaction.Disagree),
  z.literal(Reaction.Love),
]);
export const reactPost = protectedProcedure
  .input(
    z.object({
      reaction: ZReaction.nullish(),
      previousReactionId: z.string().default(""),
      postId: z.string().uuid(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (!input.reaction) {
      return void (await ctx.prisma.post.update({
        where: { id: input.postId },
        data: {
          Reactions: {
            delete: { id: input.previousReactionId },
          },
        },
      }));
    }
    return ctx.prisma.reactPost.upsert({
      where: { id: input.previousReactionId },
      create: {
        Reaction: input.reaction,
        FromUser: { connect: { id: ctx.session.user.id } },
        ToPost: { connect: { id: input.postId } },
      },
      update: {
        Reaction: input.reaction,
      },
      select: {
        id: true,
        Reaction: true,
      },
    });
  });
