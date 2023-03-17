import { prisma } from "../server/db";

export const deleteUserPermanently = async (id: string) => {
  // Deleting Comments....
  (async () => {
    await prisma.reactComment.deleteMany({
      where: { ToComment: { userId: id } },
    });
    await prisma.reactReply.deleteMany({
      where: { ToReply: { ToComment: { userId: id } } },
    });
    await prisma.commentReply.deleteMany({
      where: { ToComment: { userId: id } },
    });
    await prisma.comment.deleteMany({ where: { userId: id } });
  })();
  // Deleting Replies to Comments
  (async () => {
    await prisma.reactReply.deleteMany({ where: { ToReply: { userId: id } } });
    await prisma.commentReply.deleteMany({ where: { userId: id } });
  })();
  await prisma.connectionRequest.deleteMany({ where: { senderId: id } });
  await prisma.message.deleteMany({ where: { senderId: id } });
  await prisma.notification.deleteMany({ where: { userId: id } });
  await prisma.post.deleteMany({ where: { userId: id } });
  await prisma.reactComment.deleteMany({ where: { userId: id } });
  await prisma.reactPost.deleteMany({ where: { userId: id } });
  await prisma.reactReply.deleteMany({ where: { userId: id } });
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
