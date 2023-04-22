import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import moment from "moment";

export const getProfile = protectedProcedure
  .input(z.object({ userId: z.string().uuid() }))
  .query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        _count: {
          select: {
            Follow: true,
            FollowedBy: true,
            Posts: true,
            TrustedBy: true,
            Trust: true,
            ConnectedTo: true,
            ConnectedWith: true,
          },
        },
        id: true,
        name: true,
        Bio: true,
        image: true,
        createdAt: true,
        Gender: true,
        DateOfBirth: true,
        Country: true,
        isDeactivated: true,
        isVerified: true,
        Interests: {
          select: {
            title: true,
          },
        },
        Skills: {
          select: {
            title: true,
          },
        },
        BannedUntil: true,
        emailVerified: true,

        Blocked: { where: { id: ctx.session.user.id }, select: { id: true } },
        BlockedBy: { where: { id: ctx.session.user.id }, select: { id: true } },
        ConnectedTo: {
          where: { id: ctx.session.user.id },
          select: { id: true },
        },
        ConnectedWith: {
          where: { id: ctx.session.user.id },
          select: { id: true },
        },
        Follow: { where: { id: ctx.session.user.id }, select: { id: true } },
        FollowedBy: {
          where: { id: ctx.session.user.id },
          select: { id: true },
        },
        ConnectionRequestsReceive: {
          where: { senderId: ctx.session.user.id },
          select: { id: true },
        },
        ConnectionRequestsSent: {
          where: { receiverId: ctx.session.user.id },
          select: { id: true },
        },
        TrustedBy: { where: { id: ctx.session.user.id }, select: { id: true } },
        Trust: { where: { id: ctx.session.user.id }, select: { id: true } },
      },
    });

    if (!user || user.BannedUntil || !user.emailVerified) {
      return { notFound: true };
    }
    if (user.isDeactivated) return { userDeactivated: true };

    if (user.Blocked.length > 0) return { blocked: true };

    const relationWithVisitor:
      | "Blocked By Visitor"
      | "Request Sent"
      | "Request Recieved"
      | "Connected"
      | "Strangers" =
      user.BlockedBy.length > 0
        ? "Blocked By Visitor"
        : user.ConnectedWith.length > 0 || user.ConnectedTo.length > 0
          ? "Connected"
          : user.ConnectionRequestsSent.length > 0
            ? "Request Recieved"
            : user.ConnectionRequestsReceive.length > 0
              ? "Request Sent"
              : "Strangers";

    return {
      _count: {
        following: user._count.Follow,
        followers: user._count.FollowedBy,
        posts: user._count.Posts,
        trusted: user._count.TrustedBy,
        trusts: user._count.Trust,
        connections: user._count.ConnectedTo + user._count.ConnectedWith,
      },
      success: true,
      id: user.id,
      name: user.name,
      bio: user.Bio,
      image: user.image,
      createdAt: user.createdAt,
      gender: user.Gender,
      age: moment().diff(moment(user.DateOfBirth), "years"),
      country: user.Country,
      isVerified: user.isVerified,
      interests: user.Interests,
      skills: user.Skills,
      relationWithVisitor,
      following: {
        doesFollowVisitor: user.Follow.length > 0,
        isFollowedByVisitor: user.FollowedBy.length > 0,
      },
      trust: {
        isTrustedByVisitor: user.TrustedBy.length > 0,
        userTrustsVisitor: user.Trust.length > 0,
      },
    };
  });
