import { Dispatch, SetStateAction, useContext, useState } from "react";
import type { SelectedComment } from ".";
import { BiArrowBack } from "react-icons/bi";
import { api } from "../../../utils/api";
import { toast } from "react-toastify";
import Loading from "../../Loading";
import CommentItem from "./CommentItem";
import Image from "next/image";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";
import BadWordsFilter from "../../../utils/BadWordFilter";
import dynamic from "next/dynamic";
import { ModalContext } from "../../../pages/_app";

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const SelectedCommentComponent: React.FC<{
  selectedComment: SelectedComment;
  changeSelectedComment: Dispatch<SetStateAction<SelectedComment | undefined>>;
}> = ({ changeSelectedComment, selectedComment }) => {
  const getReplies = api.publicApi.getReplies.useInfiniteQuery(
    { limit: 10, commentId: selectedComment.id },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const [reply, changeReply] = useState("");
  const deleteReplyApi = api.publicApi.deleteComment.useMutation();
  const replyCommentApi = api.publicApi.replyComment.useMutation();
  const utils = api.useContext();
  const controlModal = useContext(ModalContext);
  const deleteComment = (commentId: string) => {
    controlModal.changeModal({
      text: "Are you sure you want to delete this reply?",
      confirmText: "Delete",
      confirm: () => {
        void toast
          .promise(deleteReplyApi.mutateAsync({ commentId }), {
            error: "Couldn't Delete Reply",
            pending: "Deleting Reply",
            success: "Reply Deleted Successfully",
          })
          .then(() => {
            void toast.promise(
              utils.publicApi.getReplies.invalidate({
                commentId: selectedComment.id,
              }),
              {
                error: "Couldn't Reload Replies",
                pending: "Reloading Replies",
                success: "Replies Reloaded",
              }
            );
          });
      },
    });
  };
  if (!getReplies.data) return <Loading />;

  const submitReply = () => {
    changeReply("");
    toast
      .promise(
        replyCommentApi.mutateAsync({
          comment: reply,
          replyToCommentId: selectedComment.id,
        }),
        {
          error: "Couldn't Reply",
          pending: "Replying",
          success: "Replied",
        }
      )
      .then(() => {
        void toast.promise(
          utils.publicApi.getReplies.invalidate({
            commentId: selectedComment.id,
          }),
          {
            error: "Couldn't Reload Replies",
            pending: "Reloading Replies",
            success: "Replies Reloaded",
          }
        );
      });
  };
  return (
    <>
      <div className="h-full rounded-lg py-2 md:px-3">
        <div className="flex items-center gap-2 rounded-lg border-b-4 border-gray-700 text-center text-sm">
          <div
            onClick={() => changeSelectedComment(selectedComment.ReplyTo)}
            className="cursor-pointer rounded-full p-2 text-lg hover:bg-gray-800"
          >
            <BiArrowBack />
          </div>
          Replies
        </div>
        <div className="flex items-center gap-2">
          <div>
            {!!selectedComment.CreatedBy.image && (
              <Link
                href={PagesLinks.getProfileLink(selectedComment.CreatedBy.id)}
              >
                <Image
                  alt="Profile Pic"
                  className="rounded-full"
                  width={30}
                  height={30}
                  src={selectedComment.CreatedBy.image}
                />
              </Link>
            )}
          </div>
          <div className="p-2">
            <Link
              href={PagesLinks.getProfileLink(selectedComment.CreatedBy.id)}
            >
              <div className="flex items-center gap-1 text-sm hover:underline">
                <h3 className="whitespace-nowrap font-semibold">
                  {selectedComment.CreatedBy.name}
                </h3>
                <h3>
                  {selectedComment.CreatedBy.isVerified && <MdVerified />}
                </h3>
              </div>
            </Link>
            <h4 className="text-sm text-gray-100 opacity-95">
              {BadWordsFilter.clean(selectedComment.Comment)}
            </h4>
          </div>
        </div>
        <div className="ml-1 flex flex-col gap-1 border-l-2 border-gray-800  pl-2">
          {getReplies.data.pages.map((page) =>
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
                ReplyTo={selectedComment}
              />
            ))
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (reply.length == 0) {
                toast.error("Reply can't be empty");
                return;
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
        </div>
      </div>
    </>
  );
};
export default SelectedCommentComponent;
