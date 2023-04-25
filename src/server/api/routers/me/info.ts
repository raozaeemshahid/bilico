import moment from "moment";
import { unbanUser } from "../../../../lib/db_helperfunctions/unbanUser";
import { isAlreadyPast } from "../../../../lib/helperFunctions";
import RedisClient from "../../../../utils/RedisClient";
import { protectedProcedure } from "../../trpc";

interface Info {
  newNotifications: number;
  newMessages: number;
  newRequests: number;
  name: string;
}

const RedisCacheSet = async ({
  data,
  userId,
}: {
  userId: string;
  data: Info;
}) => {
  const expirationTime = 60 * 5;
  await RedisClient.setEx(
    `trpc:me.info:${userId}`,
    expirationTime,
    JSON.stringify(data)
  );
};
const RedisCacheGet = async ({ userId }: { userId: string }) => {
  const data = await RedisClient.get(`trpc:me.info:${userId}`);
  if (data) return JSON.parse(data) as Info;
};

export const info = protectedProcedure.query(async ({ ctx }) => {
  const cachedInfo = await RedisCacheGet({ userId: ctx.session.user.id });
  if (cachedInfo) {
    const info = cachedInfo;
    return {
      success: true,
      newNotifications: info.newNotifications,
      newMessages: info.newMessages,
      newRequests: info.newRequests,
      name: info.name,
    };
  }
  const user = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
    select: {
      _count: {
        select: {
          ConnectionRequestsReceive: {
            where: {
              isSeen: { equals: false },
            },
          },
          MessagesReceive: { where: { isSeen: { equals: false } } },
          Notifications: { where: { isSeen: { equals: false } } },
        },
      },
      emailVerified: true,
      isDeactivated: true,
      BannedUntil: true,
      name: true,
    },
  });

  if (!user) return { notFound: true };
  if (user.BannedUntil) {
    if (isAlreadyPast(moment(user.BannedUntil))) {
      await unbanUser(ctx.session.user.id);
    } else return { banned: true };
  }
  if (user.isDeactivated) return { deactivated: true };
  if (!user.emailVerified) return { notRegistered: true };

  const info: Info = {
    newNotifications: user._count.Notifications,
    newMessages: user._count.MessagesReceive,
    newRequests: user._count.ConnectionRequestsReceive,
    name: user.name,
  };
  await RedisCacheSet({ userId: ctx.session.user.id, data: info });
  return {
    success: true,
    newNotifications: info.newNotifications,
    newMessages: info.newMessages,
    newRequests: info.newRequests,
    name: info.name,
  };
});
