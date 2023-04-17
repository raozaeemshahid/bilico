import { protectedProcedure } from "../../trpc";
import { z } from "zod";

export const getPost = protectedProcedure
  .input(
    z.object({
      postId: z.string().uuid(),
    })
  )
  .query(async ({ input, ctx }) => {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input.postId,
      },
      select: {
        _count: { select: { Comments: true, Reactions: true } },
        id: true,
        Body: true,
        CreatedAt: true,
        Interests: { select: { title: true, id: true } },
        CreatedBy: {
          select: { id: true, image: true, isVerified: true, name: true },
        },
        Reactions: {
          where: { userId: ctx.session.user.id },
          select: { Reaction: true, id: true },
        },
      },
    });
    if (!post) return { notFound: true };
    return {
      success: true,
      _count: post._count,
      id: post.id,
      body: post.Body,
      createdAt: post.CreatedAt,
      Interests: post.Interests,
      VisitorReaction: post.Reactions[0],
      createdBy: post.CreatedBy,
    };
  });
