import { protectedProcedure } from "../../trpc";
import { prisma } from "../../../db/client";
import { z } from "zod";
import { zodName } from "../../../../lib/zod";

export const ReactivateAccount = protectedProcedure.mutation(
  async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { isDeactivated: false },
    });
    return { success: true };
  }
);
