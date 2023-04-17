import { prisma } from "../../server/db";

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
