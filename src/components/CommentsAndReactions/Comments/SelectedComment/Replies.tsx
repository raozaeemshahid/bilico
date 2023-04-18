import { useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { SelectedComment } from "../";
import { api } from "../../../../utils/api";
import { toast } from "react-toastify";
import Loading from "../../../Loading";
import CommentItem from "../CommentItem";
import { ModalContext } from "../../../../pages/_app";
import FetchMoreInfiniteComponent from "../../../FetchMoreInfiniteQueryComponent";
import type { OrderOfDataByTime } from "../../../../lib/common/names";
import zodReply from "../../../../lib/zod/zodReply";

const Replies: React.FC<{
  selectedComment: SelectedComment;
  changeSelectedComment: Dispatch<SetStateAction<SelectedComment | undefined>>;
  order: OrderOfDataByTime;
}> = ({ changeSelectedComment, selectedComment, order }) => {
  const getReplies = api.publicApi.getReplies.useInfiniteQuery(
    { limit: 10, commentId: selectedComment.id, order },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const [reply, changeReply] = useState("");
  const deleteReplyApi = api.publicApi.deleteComment.useMutation();
  const replyCommentApi = api.publicApi.replyComment.useMutation();
  const utils = api.useContext();
  const controlModal = useContext(ModalContext);
  if (!getReplies.data) return <Loading />;
  const deleteComment = (commentId: string) => {
    controlModal.changeModal({
      text: "Are you sure you want to delete this reply?",
      confirmText: "Delete",
      confirm: () => {
        void toast.promise(
          deleteReplyApi.mutateAsync({ commentId }).then(() =>
            utils.publicApi.getReplies.invalidate({
              commentId: selectedComment.id,
            })
          ),
          {
            error: "Couldn't Delete Reply",
            pending: "Deleting Reply",
            success: "Reply Deleted",
          }
        );
      },
    });
  };

  const submitReply = () => {
    if (replyCommentApi.isLoading) return;
    changeReply("");
    void toast.promise(
      replyCommentApi
        .mutateAsync({
          comment: reply,
          replyToCommentId: selectedComment.id,
        })
        .then(() =>
          utils.publicApi.getReplies.invalidate({
            commentId: selectedComment.id,
          })
        ),
      {
        error: "Couldn't Reply",
        pending: "Replying",
        success: "Replied",
      }
    );
  };
  return (
    <>
      {!!selectedComment.highlightedComment && (
        <div className="rounded-lg bg-gray-600 p-1">
          <CommentItem
            key={selectedComment.highlightedComment.id}
            deleteComment={deleteComment}
            comment={{
              _count: {
                replies: selectedComment.highlightedComment._count.Replies,
              },
              body: selectedComment.highlightedComment.Comment,
              createdAt: selectedComment.highlightedComment.CreatedAt,
              id: selectedComment.highlightedComment.id,
            }}
            userData={{
              id: selectedComment.highlightedComment.CreatedBy.id,
              image: selectedComment.highlightedComment.CreatedBy.image,
              isVerified:
                selectedComment.highlightedComment.CreatedBy.isVerified,
              name: selectedComment.highlightedComment.CreatedBy.name,
            }}
            changeSelectedComment={changeSelectedComment}
            ReplyTo={selectedComment}
            theme="Dark"
            highlightedComment={{
              ...selectedComment.highlightedComment,
              ReplyTo: selectedComment,
            }}
          />
        </div>
      )}
      {getReplies.data.pages.map((page) =>
        page.items.map((comment) => {
          if (
            selectedComment.highlightedComment &&
            comment.id == selectedComment.highlightedComment.id
          )
            return null;
          return (
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
              ReplyTo={selectedComment}
              theme="Dark"
            />
          );
        })
      )}
      <FetchMoreInfiniteComponent
        fetchNextPage={() => void getReplies.fetchNextPage()}
        hasNextPage={getReplies.hasNextPage}
        isFetchingNextPage={getReplies.isFetchingNextPage}
        endingMsg=""
      />
      {!replyCommentApi.isLoading && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const parsedReply = zodReply.safeParse(reply);
            if (!parsedReply.success) {
              return parsedReply.error.errors.forEach((err) =>
                toast.error(err.message)
              );
            }
            submitReply();
          }}
          className="flex"
        >
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder-gray-400 shadow-lg shadow-gray-800 focus:border-blue-500 focus:ring-blue-500"
            placeholder={`Reply To ${selectedComment.CreatedBy.name}'s Comment`}
            value={reply}
            onChange={(e) => changeReply(e.target.value)}
          />
        </form>
      )}
    </>
  );
};
export default Replies;
