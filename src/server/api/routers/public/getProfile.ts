import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import moment from "moment";
import { Gender } from "@prisma/client";
import RedisClient from "../../../../utils/RedisClient";
import { getRelationWithUser } from "../../../../lib/db_helperfunctions/getRelationWithUser";

interface Profile {
  _count: {
    following: number;
    followers: number;
    posts: number;
    trusted: number;
    trusts: number;
    connections: number;
  };
  success: boolean;
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
  createdAt: Date;
  gender: Gender | null;
  age: number;
  country: string | null;
  isVerified: boolean;
  interests: {
    title: string;
  }[];
  skills: {
    title: string;
  }[];
}

const generateRedisCacheId = (userId: string) =>
  `trpc:public.getProfile:${userId}`;
const RedisCacheSet = async ({
  data,
  userId,
}: {
  userId: string;
  data: Profile;
}) => {
  const expirationTime = 60 * 30;
  if (!RedisClient.isReady) return;
  await RedisClient.setEx(
    generateRedisCacheId(userId),
    expirationTime,
    JSON.stringify(data)
  );
};
const RedisCacheGet = async ({ userId }: { userId: string }) => {
  if (!RedisClient.isReady) return;
  const data = await RedisClient.get(generateRedisCacheId(userId));
  if (data) return JSON.parse(data) as Profile;
};

export const getProfile = protectedProcedure
  .input(z.object({ userId: z.string().uuid() }))
  .query(async ({ input, ctx }) => {
    const relation = await getRelationWithUser({
      sessionId: ctx.session.user.id,
      otherUserId: input.userId,
    });
    if (!relation) {
      return { notFound: true };
    }
    if (relation.blockedVisitor) {
      return { blocked: true };
    }
    const cachedProfile = await RedisCacheGet({ userId: input.userId });
    if (cachedProfile) {
      const profile = cachedProfile;
      // rewriting all objects keys for frontend type declrations
      return {
        _count: profile._count,
        success: true,
        id: profile.id,
        name: profile.name,
        bio: profile.bio,
        image: profile.image,
        createdAt: profile.createdAt,
        gender: profile.gender,
        age: profile.age,
        country: profile.country,
        isVerified: profile.isVerified,
        interests: profile.interests,
        skills: profile.skills,
        relationWithVisitor: relation.relationWithVisitor,
        following: relation.following,
        trust: relation.trust,
      };
    }
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
      },
    });

    if (!user || user.BannedUntil || !user.emailVerified) {
      return { notFound: true };
    }
    if (user.isDeactivated) return { userDeactivated: true };

    const profile: Profile = {
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
    };

    await RedisCacheSet({ userId: input.userId, data: profile });
    // rewriting all objects keys for frontend type declrations
    return {
      _count: profile._count,
      success: true,
      id: profile.id,
      name: profile.name,
      bio: profile.bio,
      image: profile.image,
      createdAt: profile.createdAt,
      gender: profile.gender,
      age: profile.age,
      country: profile.country,
      isVerified: profile.isVerified,
      interests: profile.interests,
      skills: profile.skills,
      relationWithVisitor: relation.relationWithVisitor,
      following: relation.following,
      trust: relation.trust,
    };
  });
