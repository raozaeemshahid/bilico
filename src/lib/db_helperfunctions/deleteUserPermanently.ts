import { prisma } from "../../server/db";
import { deleteAllCommentsOfAUser } from "./deleteAllCommentsOfAUser";
import { deleteAllPostsOfAUser } from "./deleteAllPostsOfAUser";

export const deleteUserPermanently = async (id: string) => {
  await deleteAllCommentsOfAUser(id);
  await deleteAllPostsOfAUser(id);
  await prisma.connectionRequest.deleteMany({
    where: { OR: [{ senderId: id }, { receiverId: id }] },
  });
  await prisma.message.deleteMany({
    where: { OR: [{ senderId: id }, { receiverId: id }] },
  });
  await prisma.notification.deleteMany({ where: { userId: id } });
  await prisma.reactPost.deleteMany({ where: { userId: id } });
  await prisma.reportToAdmin.deleteMany({ where: { reportedUserId: id } });
  await prisma.user.delete({
    where: { id },
  });
  void prisma.account.deleteMany({where: {userId: id}})
  void prisma.session.deleteMany({where: {userId: id}})
};
