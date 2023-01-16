import { prisma } from "../server/db";
const {
  account,
  answer,
  answerUpvote,
  comment,
  commentReply,
  connectionRequest,
  message,
  notification,
  question,
  post,
  reactComment,
  reactPost,
  reactReply,
  reportToAdmin,
  seriesOfPost,
  session,
  user,
} = prisma;

export const deleteUserPermanently = async (id: string) => {
  await account.deleteMany({ where: { userId: id } });
  await answer.deleteMany({ where: { userId: id } });
  await answerUpvote.deleteMany({ where: { userId: id } });
  await comment.deleteMany({ where: { userId: id } });
  await commentReply.deleteMany({ where: { userId: id } });
  await connectionRequest.deleteMany({ where: { senderId: id } });
  await message.deleteMany({ where: { senderId: id } });
  await notification.deleteMany({ where: { userId: id } });
  await question.deleteMany({ where: { userId: id } });
  await post.deleteMany({ where: { userId: id } });
  await reactComment.deleteMany({ where: { userId: id } });
  await reactPost.deleteMany({ where: { userId: id } });
  await reactReply.deleteMany({ where: { userId: id } });
  await reportToAdmin.deleteMany({ where: { reportedUserId: id } });
  await seriesOfPost.deleteMany({
    where: { Posts: { every: { userId: id } } },
  });
  await session.deleteMany({ where: { userId: id } });
  await user.update({
    where: { id },
    data: {
      emailVerified: undefined,
    },
  });
};

export const unbanUser = async (id: string) => {
  await user.update({
    where: {
      id,
    },
    data: {
      BannedUntil: null,
      ReasonOfBanned: undefined,
    },
  });
};
