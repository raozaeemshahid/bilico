import { prisma } from "../../server/db";

export const getPostIdFromAnyNestedCommentId: (
  commentId: string
) => Promise<string> = async (commentId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
    select: { replyToCommentId: true, postId: true },
  });

  if (comment.postId) return comment.postId;
  if (comment.replyToCommentId)
    return getPostIdFromAnyNestedCommentId(comment.replyToCommentId);
  throw new Error("Comment is Abondoned");
};
