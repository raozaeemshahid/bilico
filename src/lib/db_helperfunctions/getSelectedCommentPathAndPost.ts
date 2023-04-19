import type { Interest, Reaction } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { SelectedComment } from "../../components/CommentsAndReactions/Comments";
import { getCommentWithOnPostAndReplyTo } from "./getCommmentWithOnPostAndReplyTo";

export interface Post {
  Interests: Interest[];
  _count: {
    Comments: number;
    Reactions: number;
  };
  id: string;
  CreatedBy: {
    id: string;
    name: string;
    image: string | null;
    isVerified: boolean;
  };
  reactionByVisitor: { id: string; Reaction: Reaction } | undefined;
  CreatedAt: Date;
  Body: string;
}
export const getSelectedCommentPathAndPost = async (input: {
  sessionUserId: string;
  commentId: string;
}) => {
  const findSelectedCommentPathAndPost = async (currentComment: {
    commentId: string;
    highlightedComment?: SelectedComment;
  }): Promise<{
    selectedComment: SelectedComment;
    post: Post;
  }> => {
    const comment = await getCommentWithOnPostAndReplyTo({
      sessionUserId: input.sessionUserId,
      commentId: currentComment.commentId,
    });

    if (!comment)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Comment Not Found",
      });
    const selectedComment: SelectedComment = {
      id: comment.id,
      CreatedBy: comment.CreatedBy,
      CreatedAt: comment.CreatedAt,
      _count: comment._count,
      Comment: comment.Comment,
      CommentType: comment.CommentType,
      highlightedComment: currentComment.highlightedComment,
    };
    if (comment.OnPost) {
      const reactionByVisitor = comment.OnPost.Reactions[0];
      return {
        selectedComment: {
          ...selectedComment,
          ReplyTo: undefined,
        },
        post: {
          _count: comment.OnPost._count,
          Body: comment.OnPost.Body,
          CreatedAt: comment.OnPost.CreatedAt,
          CreatedBy: comment.OnPost.CreatedBy,
          id: comment.OnPost.id,
          Interests: comment.OnPost.Interests,
          reactionByVisitor: reactionByVisitor
            ? {
              id: reactionByVisitor.id,
              Reaction: reactionByVisitor.Reaction,
            }
            : undefined,
        },
      };
    }
    if (!comment.ReplyTo)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Comment is Abandoned",
      });
    const parentComment = await findSelectedCommentPathAndPost({
      commentId: comment.ReplyTo.id,
      highlightedComment: selectedComment,
    });
    return {
      selectedComment: {
        ...selectedComment,
        ReplyTo: parentComment.selectedComment,
      },
      post: parentComment.post,
    };
  };
  return findSelectedCommentPathAndPost({ commentId: input.commentId });
};
