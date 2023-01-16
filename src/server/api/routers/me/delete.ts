import { protectedProcedure } from "../../trpc";
import { deleteUserPermanently } from "../../../../lib/db_helperFunctions";

export const deleteMyAccount = protectedProcedure.mutation(async ({ ctx }) => {
  await deleteUserPermanently(ctx.session.user.id);
  return { success: true };
});
