import { Comment } from "@prisma/client";
import { prisma } from "../server/db";

export const deleteCommentsWithAllNestedReplies = async (
  commentId: string
): Promise<void> => {
  // delete all nested comments
  const nestedComments = await prisma.comment.findMany({
    where: { replyToCommentId: commentId },
  });
  await Promise.all(
    nestedComments.map((comment) =>
      deleteCommentsWithAllNestedReplies(comment.id)
    )
  );

  // delete the comment
  await prisma.comment.delete({ where: { id: commentId } });
};

export const deleteUserPermanently = async (id: string) => {
  const comments = await prisma.comment.findMany({
    where: { CommenterUserId: id },
  });
  await Promise.all(
    comments.map((comment) => deleteCommentsWithAllNestedReplies(comment.id))
  );
  await prisma.connectionRequest.deleteMany({ where: { senderId: id } });
  await prisma.message.deleteMany({ where: { senderId: id } });
  await prisma.notification.deleteMany({ where: { userId: id } });
  await prisma.post.deleteMany({ where: { userId: id } });
  await prisma.reactPost.deleteMany({ where: { userId: id } });
  await prisma.reportToAdmin.deleteMany({ where: { reportedUserId: id } });
  await prisma.user.delete({
    where: { id },
  });
};

export const unbanUser = async (id: string) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      BannedUntil: null,
      ReasonOfBanned: undefined,
    },
  });
};
