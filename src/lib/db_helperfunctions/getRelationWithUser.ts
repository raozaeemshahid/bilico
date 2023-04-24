import { prisma } from "../../server/db";

export const getRelationWithUser = async (input: {
  sessionId: string;
  otherUserId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: input.otherUserId,
    },
    select: {
      _count: {
        select: {
          Blocked: { where: { id: input.sessionId } },
          BlockedBy: { where: { id: input.sessionId } },
          ConnectedTo: { where: { id: input.sessionId } },
          ConnectedWith: { where: { id: input.sessionId } },
          Follow: { where: { id: input.sessionId } },
          FollowedBy: { where: { id: input.sessionId } },
          ConnectionRequestsReceive: { where: { senderId: input.sessionId } },
          ConnectionRequestsSent: { where: { receiverId: input.sessionId } },
          Trust: { where: { id: input.sessionId } },
          TrustedBy: { where: { id: input.sessionId } },
        },
      },
    },
  });
  if (!user) return;

  const relationWithVisitor:
    | "Blocked By Visitor"
    | "Request Sent"
    | "Request Recieved"
    | "Connected"
    | "Strangers" =
    user._count.BlockedBy > 0
      ? "Blocked By Visitor"
      : user._count.ConnectedWith > 0 || user._count.ConnectedTo > 0
      ? "Connected"
      : user._count.ConnectionRequestsSent > 0
      ? "Request Recieved"
      : user._count.ConnectionRequestsReceive > 0
      ? "Request Sent"
      : "Strangers";
  return {
    blockedVisitor: user._count.Blocked > 0,
    relationWithVisitor,
    following: {
      doesFollowVisitor: user._count.Follow > 0,
      isFollowedByVisitor: user._count.FollowedBy > 0,
    },
    trust: {
      userTrustsVisitor: user._count.Trust > 0,
      isTrustedByVisitor: user._count.TrustedBy > 0,
    },
  };
};
