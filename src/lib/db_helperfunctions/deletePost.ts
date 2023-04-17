import { prisma } from "../../server/db";
import { deleteAllCommentsOfAPost } from "./deleteAllCommentsOfAPost";

export const deletePostCompletely = async (postId: string) => {
  await deleteAllCommentsOfAPost(postId);
  await prisma.reactPost.deleteMany({
    where: {
      postId,
    },
  });
  await prisma.post.delete({
    where: { id: postId },
  });
};
