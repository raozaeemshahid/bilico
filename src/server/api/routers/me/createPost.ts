import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import zodPost from "../../../../lib/zod/zodPost";

export const createPost = protectedProcedure
  .input(
    z.object({ interests: z.array(z.string()), postBody: zodPost })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        Posts: {
          create: {
            Body: input.postBody,
            Interests: {
              connect: input.interests.map((interest) => ({ id: interest })),
            },
          },
        },
      },
    });
    return { success: true };
  });
