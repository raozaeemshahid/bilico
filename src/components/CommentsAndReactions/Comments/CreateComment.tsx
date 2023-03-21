import { CommentType } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

const CreateComment: React.FC<{
  comment: string;
  changeComment: Dispatch<SetStateAction<string>>;
  currentTab: CommentType;
  postId: string;
}> = ({ changeComment, postId, comment, currentTab }) => {
  const createComment = api.publicApi.createComment.useMutation();
  const utils = api.useContext();
  return (
    <div className="">
      <form
        onSubmit={(e) => {
          e.preventDefault();
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
              void utils.publicApi.getComments.invalidate();
            });
        }}
      >
        <input
          className="w-full rounded-lg bg-gray-100 p-[3px] px-3 text-gray-900 shadow-md shadow-gray-900"
          value={comment}
          onChange={(e) => {
            changeComment(e.target.value);
          }}
          placeholder={`${currentTab == "Agree" ? "How do you Agree?" : ""}${
            currentTab == "Disagree" ? "How do you Disagree?" : ""
          }${currentTab == "Opinion" ? "What's your Opinion?" : ""}${
            currentTab == "Appreciation" ? "Write your Appreciation?" : ""
          }`}
        />
      </form>
    </div>
  );
};

export default CreateComment;
