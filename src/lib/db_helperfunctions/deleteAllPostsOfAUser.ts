import { prisma } from "../../server/db";
import { deleteAllAbandonedComents } from "./deleteAllAbandonedComments";

export const deleteAllPostsOfAUser = async (userId: string) => {
  // abandoning all comments of all the posts of a user
  await prisma.comment.updateMany({
    where: { OnPost: { userId } },
    data: { postId: null },
  });
  // deleting all reactions on that post
  await prisma.reactPost.deleteMany({
    where: {
      ToPost: {
        userId,
      },
    },
  });
  // deleting the posts
  await prisma.post.deleteMany({ where: { userId } });
  void deleteAllAbandonedComents();
};
