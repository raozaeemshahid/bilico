import { CommentType } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";
import { useState } from "react";

const CreateComment: React.FC<{
  comment: string;
  changeComment: Dispatch<SetStateAction<string>>;
  currentTab: CommentType;
  postId: string;
}> = ({ changeComment, postId, comment, currentTab }) => {
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
            Comment
          </button>
        </div>
      </div>
    );
  const submitComment = () => {
    changeComment("");
    toast
      .promise(
        createComment.mutateAsync({
          comment,
          postId,
          commentType: currentTab,
        }),
        {
          error: "Couldn't Comment",
          pending: "Commenting",
          success: "Commented",
        }
      )
      .then(() => {
        void utils.publicApi.getCommentsCount.invalidate({ postId });
        void toast.promise(
          utils.publicApi.getComments.invalidate({
            postId,
            commentType: currentTab,
          }),
          {
            success: "Comments Reloaded",
            pending: "Reloading",
            error: "Couldn't Reload",
          }
        );
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
          placeholder={`${currentTab == "Agree" ? "How do you Agree?" : ""}${currentTab == "Disagree" ? "How do you Disagree?" : ""
            }${currentTab == "Opinion" ? "What's your Opinion?" : ""}${currentTab == "Appreciation" ? "Write your Appreciation?" : ""
            }`}
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
            if (comment.length == 0) {
              toast.error("Comment can't be empty");
              return;
            }
            submitComment();
            changeISCommenting(false);
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CreateComment;
