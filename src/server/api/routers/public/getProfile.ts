import { z } from "zod";
import { publicProcedure } from "../../trpc";
import moment from "moment";
import type { Gender } from "@prisma/client";

export const getProfile = publicProcedure
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

        Blocked: { where: { id: input.userId }, select: { id: true } },
        BlockedBy: { where: { id: input.userId }, select: { id: true } },
        ConnectedTo: { where: { id: input.userId }, select: { id: true } },
        ConnectedWith: { where: { id: input.userId }, select: { id: true } },
        Follow: { where: { id: input.userId }, select: { id: true } },
        FollowedBy: { where: { id: input.userId }, select: { id: true } },
        ConnectionRequestsReceive: {
          where: { senderId: input.userId },
          select: { id: true },
        },
        ConnectionRequestsSent: {
          where: { receiverId: input.userId },
          select: { id: true },
        },
        TrustedBy: { where: { id: input.userId }, select: { id: true } },
        Trust: { where: { id: input.userId }, select: { id: true } },
      },
    });

    if (!user || user.BannedUntil || !user.emailVerified) {
      return { notFound: true };
    }
    if (user.isDeactivated) return { userDeactivated: true };

    if (user.Blocked.length > 0) return { blocked: true };

    const relationWithVisitor:
      | "Blocked By Vistor"
      | "Request Sent"
      | "Request Recieved"
      | "Connected"
      | "Strangers" = user.BlockedBy.length > 0
        ? "Blocked By Vistor"
        : user.ConnectedWith.length > 0 || user.ConnectedTo.length > 0
          ? "Connected"
          : user.ConnectionRequestsReceive.length > 0
            ? "Request Recieved"
            : user.ConnectionRequestsSent.length > 0
              ? "Request Sent"
              : "Strangers";

    return {
      _count: {
        following: user._count.Follow,
        followers: user._count.FollowedBy,
        posts: user._count.Posts,
        trusted: user._count.TrustedBy,
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
