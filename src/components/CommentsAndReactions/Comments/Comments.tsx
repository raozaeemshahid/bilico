import type { CommentType } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import type { SelectedComment } from ".";
import Loading from "../../Loading";

import { api } from "../../../utils/api";
import CommentItem from "./CommentItem";
import { toast } from "react-toastify";

const CommentsComponent: React.FC<{
  postId: string;
  tab: CommentType;
  changeCommentCount: Dispatch<SetStateAction<number>>;
  changeSelectedComment: Dispatch<SetStateAction<SelectedComment | undefined>>;
}> = ({ tab, postId, changeSelectedComment, changeCommentCount }) => {
  const getComments = api.publicApi.getComments.useInfiniteQuery(
    { limit: 10, postId, commentType: tab },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const deleteCommentApi = api.publicApi.deleteComment.useMutation();
  const utils = api.useContext();
  const deleteComment = (commentId: string) => {
    void toast
      .promise(deleteCommentApi.mutateAsync({ commentId }), {
        error: "Couldn't Delete Comment",
        pending: "Deleting Comment",
        success: "Comment Deleted Successfully",
      })
      .then(() => {
        void utils.publicApi.getCommentsCount.invalidate({ postId });
        changeCommentCount((count) => count - 1);
        void toast.promise(
          utils.publicApi.getComments.invalidate({
            postId,
            commentType: tab,
          }),
          {
            error: "Couldn't Reload Comments",
            pending: "Reloading Comments",
            success: "Comments Reloaded",
          }
        );
      });
  };
  if (!getComments.data) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-1">
        {getComments.data.pages.map((page) =>
          page.items.map((comment) => (
            <CommentItem
              key={comment.id}
              deleteComment={deleteComment}
              comment={{
                _count: { replies: comment._count.Replies },
                body: comment.Comment,
                createdAt: comment.CreatedAt,
                id: comment.id,
              }}
              userData={{
                id: comment.CreatedBy.id,
                image: comment.CreatedBy.image,
                isVerified: comment.CreatedBy.isVerified,
                name: comment.CreatedBy.name,
              }}
              changeSelectedComment={changeSelectedComment}
              theme="Dark"
            />
          ))
        )}
      </div>
    </>
  );
};
export default CommentsComponent;
