import { deleteUserPermanently } from "../../../../lib/db_helperfunctions/deleteUserPermanently";
import { protectedProcedure } from "../../trpc";

export const deleteMyAccount = protectedProcedure.mutation(async ({ ctx }) => {
  await deleteUserPermanently(ctx.session.user.id);
  return { success: true };
});
