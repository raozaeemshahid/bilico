import TopRightDropDown, { DropDownOption } from ".";
import { copyUrlToClipboard } from "../../lib/copyUrl";
import PagesLinks from "../../lib/PagesLink";


const PostDropDown: React.FC<{
  userSessionId: string;
  userDataId: string;
  postId: string;
  deletePost: (id: string) => void;
}> = ({ deletePost, postId, userDataId, userSessionId }) => {
  const options: DropDownOption[] = [
    {
      label: "Coply Link",
      onClick: () => {
        copyUrlToClipboard(PagesLinks.getPostLink(postId));
      },
    },
  ];
  if (userSessionId == userDataId) {
    options.push({
      label: "Delete",
      onClick: () => deletePost(postId),
    });
  }
  return (
    <>
      <TopRightDropDown options={options} />
    </>
  );
};
export default PostDropDown;
