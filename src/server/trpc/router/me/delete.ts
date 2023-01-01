import { protectedProcedure } from "../../trpc";
import { prisma } from "../../../db/client";
import { z } from "zod";
import { zodName } from "../../../../lib/zod";
import { deleteUserPermanently } from "../../../../lib/db_helperFunctions";

export const deleteMyAccount = protectedProcedure.mutation(async ({ ctx }) => {
  await deleteUserPermanently(ctx.session.user.id);
  return { success: true };
});
