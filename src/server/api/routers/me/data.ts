import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const data = protectedProcedure.query(async ({ ctx }) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.session.user.id,
    },
    select: {
      _count: {
        select: {
          ConnectedTo: true,
          ConnectedWith: true,
          Follow: true,
          FollowedBy: true,
          Posts: true,
          TrustedBy: true,
          Trust: true,
        },
      },
      name: true,
      Country: true,
      createdAt: true,
      DateOfBirth: true,
      email: true,
      Gender: true,
      image: true,
      Interests: true,
      isVerified: true,
      Skills: true,
      Bio: true,
    },
  });

  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
    });

  return {
    success: true,
    ...user,
  };
});
