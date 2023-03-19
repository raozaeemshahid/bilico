import { prisma } from "../server/db";

export const deleteUserPermanently = async (id: string) => {
  // Deleting Comments....
  await prisma.comment.deleteMany({ where: { CommenterUserId: id } });
  // Deleting Replies to Comments
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
