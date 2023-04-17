import { prisma } from "../../server/db";
import { deleteAllAbandonedComents } from "./deleteAllAbandonedComments";

export const deleteCommentWithAllNestedReplies = async (
  commentId: string
): Promise<void> => {
  // abandoning all replies of comments to easily delete the wanted comment
  await prisma.comment.updateMany({
    where: {
      replyToCommentId: commentId,
    },
    data: {
      replyToCommentId: null,
    },
  });

  // deleting the comment
  await prisma.comment.delete({ where: { id: commentId } });

  // non-blockingly deleting all comments which are abandoned
  void deleteAllAbandonedComents();
};
