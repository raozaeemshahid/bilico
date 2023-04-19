import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import zodPost from "../../../../lib/zod/zodPost";

export const createPost = protectedProcedure
  .input(z.object({ interests: z.array(z.string()), postBody: zodPost }))
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.post.create({
      data: {
        Body: input.postBody,
        Interests: {
          connect: input.interests.map((interest) => ({ id: interest })),
        },
        CreatedBy: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });
    return { success: true };
  });
