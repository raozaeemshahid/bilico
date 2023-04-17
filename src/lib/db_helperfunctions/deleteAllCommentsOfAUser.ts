import { prisma } from "../../server/db";
import { deleteAllAbandonedComents } from "./deleteAllAbandonedComments";

export const deleteAllCommentsOfAUser = async (userId: string) => {
  // abandoning all replies of all the user's comments
  await prisma.comment.updateMany({
    where: {
      ReplyTo: {
        CommenterUserId: userId,
      },
    },
    data: {
      replyToCommentId: null,
    },
  });

  // deleting all comments of user
  await prisma.comment.deleteMany({
    where: {
      CommenterUserId: userId,
    },
  });

  void deleteAllAbandonedComents();
};
