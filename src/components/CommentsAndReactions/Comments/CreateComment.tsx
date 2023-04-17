import type { CommentType } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";
import { useState } from "react";
import zodComment from "../../../lib/zod/zodComment";

const CreateComment: React.FC<{
  comment: string;
  changeComment: Dispatch<SetStateAction<string>>;
  changeCommentCount: Dispatch<SetStateAction<number>>;
  currentTab: CommentType;
  postId: string;
}> = ({ changeComment, postId, comment, currentTab, changeCommentCount }) => {
  const createComment = api.publicApi.createComment.useMutation();
  const [isCommenting, changeISCommenting] = useState(false);

  const utils = api.useContext();
  if (!isCommenting)
    return (
      <div>
        <div className="flex justify-end">
          <button
            className="m-2 flex rounded bg-green-600 py-2 px-4 text-sm font-bold text-white shadow-sm shadow-green-600 hover:bg-green-600"
            onClick={() => changeISCommenting(true)}
          >
            {currentTab == "Question"
              ? "Ask"
              : currentTab == "Appreciation"
              ? "Appreciate"
              : "Comment"}
          </button>
        </div>
      </div>
    );
  const submitComment = () => {
    changeComment("");
    void toast
      .promise(
        createComment
          .mutateAsync({
            comment,
            postId,
            commentType: currentTab,
          })
          .then(() =>
            Promise.all([
              utils.publicApi.getCommentsCount.invalidate({ postId }),
              utils.publicApi.getComments.invalidate({
                postId,
                commentType: currentTab,
              }),
            ])
          ),
        {
          error: "Couldn't Comment",
          pending: "Commenting",
          success: "Commented",
        }
      )
      .then(() => {
        changeCommentCount((count) => count + 1);
      });
  };
  return (
    <div className="">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <textarea
          value={comment}
          onChange={(e) => changeComment(e.target.value)}
          id="large-input"
          className="sm:text-md block w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-lg text-gray-200 placeholder-gray-400 shadow-lg shadow-gray-800 focus:border-blue-500 focus:ring-blue-500"
          placeholder={`${
            currentTab == "Question" ? "What's your Question?" : ""
          }${currentTab == "Suggestion" ? "What's your Suggestion?" : ""}${
            currentTab == "Opinion" ? "What's your Opinion?" : ""
          }${currentTab == "Appreciation" ? "Write your Appreciation?" : ""}`}
        />
      </form>
      <div className="flex justify-end">
        <button
          className="m-2 flex rounded bg-red-600 py-2 px-4 text-sm font-bold text-white shadow-sm shadow-green-600 hover:bg-red-600"
          onClick={() => {
            changeISCommenting(false);
          }}
        >
          Cancel
        </button>
        <button
          className="m-2 flex rounded bg-green-600 py-2 px-4 text-sm font-bold text-white shadow-sm shadow-green-600 hover:bg-green-600"
          onClick={() => {
            const parsedComment = zodComment.safeParse(comment);
            if (!parsedComment.success) {
              return parsedComment.error.errors.forEach((err) =>
                toast.error(err.message)
              );
            }
            submitComment();
            changeISCommenting(false);
          }}
        >
          {currentTab == "Question"
            ? "Ask"
            : currentTab == "Appreciation"
            ? "Appreciate"
            : "Comment"}
        </button>
      </div>
    </div>
  );
};

export default CreateComment;
