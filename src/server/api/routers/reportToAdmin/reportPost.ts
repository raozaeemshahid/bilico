import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import PagesLinks from "../../../../lib/PagesLink";

export const reportPost = protectedProcedure
  .input(z.object({ postId: z.string().uuid() }))
  .mutation(async ({ input, ctx }) => {
    const previousReport = await ctx.prisma.reportToAdmin.findFirst({
      where: {
        reportedPostId: input.postId,
      },
    });
    if (previousReport) return { success: true };

    await ctx.prisma.reportToAdmin.create({
      data: {
        link: PagesLinks.getPostLink(input.postId),
        type: "POST",
        ReportedPost: {
          connect: {
            id: input.postId,
          },
        },
      },
    });
    return { success: true };
  });
