import { prisma } from "../../server/db";

export const deleteAllAbandonedComents = async () => {
  // Abandoning Replies of all Abandoned comments so they'll have zero replies
  await prisma.comment.updateMany({
    where: {
      ReplyTo: { replyToCommentId: null, postId: null },
    },
    data: {
      replyToCommentId: null,
    },
  });

  // deleting all abandoned comments with zero replies
  await prisma.comment.deleteMany({
    where: {
      replyToCommentId: null,
      postId: null,
      Replies: { none: { replyToCommentId: { not: null } } },
    },
  });
  // if there are more abandoned comments? delete them all....
  if (
    (await prisma.comment.count({
      where: { postId: null, replyToCommentId: null },
    })) > 0
  )
    void deleteAllAbandonedComents();
};
