import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { getSelectedCommentPathAndPost } from "../../../../lib/db_helperfunctions/getSelectedCommentPathAndPost";

export const getHighlightedComment = protectedProcedure
  .input(
    z.object({
      commentId: z.string().uuid(),
    })
  )
  .query(async ({ input, ctx }) => {
    const { selectedComment, post } = await getSelectedCommentPathAndPost({
      commentId: input.commentId,
      sessionUserId: ctx.session.user.id,
    });
    if (selectedComment.ReplyTo) {
      return {
        selectedComment: selectedComment.ReplyTo,
        post,
      };
    }
    return { selectedComment, post };
  });
