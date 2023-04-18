import { TRPCError } from "@trpc/server";
import { prisma } from "../../server/db";

export const getCommentWithOnPostAndReplyTo = async (input: {
  commentId: string;
  sessionUserId: string;
}) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: input.commentId,
    },
    select: {
      id: true,
      Comment: true,
      _count: { select: { Replies: true } },
      CreatedBy: {
        select: {
          id: true,
          image: true,
          isVerified: true,
          name: true,
        },
      },
      CreatedAt: true,
      OnPost: {
        select: {
          CreatedAt: true,
          id: true,
          CreatedBy: {
            select: {
              id: true,
              image: true,
              isVerified: true,
              name: true,
            },
          },
          Body: true,
          Interests: true,
          _count: { select: { Comments: true, Reactions: true } },
          Reactions: {
            where: {
              userId: input.sessionUserId,
            },
          },
        },
      },
      ReplyTo: {
        select: {
          id: true,
          Comment: true,
          _count: { select: { Replies: true } },
          CreatedBy: {
            select: {
              id: true,
              image: true,
              isVerified: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (!comment)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Comment Not Found",
    });
  return comment;
};
