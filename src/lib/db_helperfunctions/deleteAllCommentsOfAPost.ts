import { prisma } from "../../server/db";
import { deleteAllAbandonedComents } from "./deleteAllAbandonedComments";

export const deleteAllCommentsOfAPost = async (postId: string) => {
  // abandoning all replies of all the post's comments
  await prisma.comment.updateMany({
    where: {
      ReplyTo: {
        postId,
      },
    },
    data: {
      replyToCommentId: null,
    },
  });

  // deleting all comments of post
  await prisma.comment.deleteMany({
    where: {
      postId,
    },
  });

  void deleteAllAbandonedComents();
};
