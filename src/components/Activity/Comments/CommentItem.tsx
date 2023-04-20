import moment from "moment";
import BadWordsFilter from "../../../utils/BadWordFilter";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";
import type { CommentType } from "@prisma/client";
import splitAndGetStartingString from "../splitAndGetStartingString";

const CommentItem: React.FC<{
  comment: {
    id: string;
    createdAt: Date;
    body: string;
    type?: CommentType | "All" | null;
    postId: string | null;
    replyToCommentId: string | null;
  };
}> = ({ comment }) => {
  let text = "";
  const addToText = (add: string) => (text += " " + add);
  if (comment.postId) {
    if (comment.type) {
      addToText(
        comment.type == "Question"
          ? "asked a question on a post"
          : comment.type == "Appreciation"
          ? "appreciated a post"
          : comment.type == "Opinion"
          ? "gave a opinion on a post"
          : comment.type == "Suggestion"
          ? "gave a suggestion on a post"
          : "commented on a post"
      );
    } else addToText("commented on a post");
  } else addToText("replied to a comment");
  return (
    <>
      <div className="w-full rounded-lg border-l border-b border-gray-700 bg-gray-800 px-0 shadow-md shadow-gray-900 hover:bg-gray-700 xs:px-4">
        <Link href={PagesLinks.getCommentLink(comment.id)}>
          <div className="py-2 text-gray-300">
            <h2>{text}</h2>
          </div>
          <div className="ml-1 flex rounded-lg border-l-2  border-gray-700 p-2">
            <h4 className="text-sm text-gray-100  opacity-95">
              {BadWordsFilter.clean(
                splitAndGetStartingString({ string: comment.body })
              )}
            </h4>
          </div>
          <div className="my-1 flex items-center justify-end">
            <h2 className="text-xs opacity-70">
              {moment(comment.createdAt).fromNow()}
            </h2>
          </div>
        </Link>
      </div>
    </>
  );
};
export default CommentItem;
