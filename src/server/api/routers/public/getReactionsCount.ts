import { protectedProcedure } from "../../trpc";
import { Reaction } from "@prisma/client";
import { z } from "zod";

export const getReactionsCount = protectedProcedure
  .input(z.object({ postId: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const count: { [react: string]: number } = {};
    await Promise.all(
      Object.values(Reaction).map((react) =>
        ctx.prisma.reactPost
          .count({
            where: {
              postId: input.postId,
              Reaction: react,
            },
          })
          .then((data) => {
            count[react] = data;
          })
      )
    );
    return count;
  });
