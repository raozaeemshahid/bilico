import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { deletePostCompletely } from "../../../../lib/db_helperfunctions/deletePost";

export const hasSeenConnectionRequests = protectedProcedure.mutation(
  async ({ ctx }) => {
    await ctx.prisma.connectionRequest.updateMany({
      data: {
        isSeen: true,
      },
      where: {
        receiverId: ctx.session.user.id,
        isSeen: false
      },
    });
    return { success: true };
  }
);
