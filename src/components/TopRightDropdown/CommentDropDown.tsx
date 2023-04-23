import DropDown from "./InlineDropDown";
import { copyUrlToClipboard } from "../../lib/copyUrl";
import PagesLinks from "../../lib/PagesLink";
import type { DropDownOption } from ".";


const CommentDropDown: React.FC<{
  userSessionId: string;
  userDataId: string;
  commentId: string;
  deleteComment: (id: string) => void;
}> = ({ deleteComment, commentId, userDataId, userSessionId }) => {
  const options: DropDownOption[] = [
    {
      label: "Copy Link",
      onClick: () => copyUrlToClipboard(PagesLinks.getCommentLink(commentId)),
    },
  ];
  if (userSessionId == userDataId) {
    options.push({
      label: "Delete",
      onClick: () => deleteComment(commentId),
    });
  }
  return (
    <>
      <DropDown options={options} />
    </>
  );
};
export default CommentDropDown;
