import moment from "moment";
import BadWordsFilter from "../../../utils/BadWordFilter";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";
import splitAndGetStartingString from "../splitAndGetStartingString";
import type { Reaction } from "@prisma/client";

const ReactionItem: React.FC<{
  reaction: {
    id: string;
    createdAt: Date;
    body: string;
    type: Reaction;
    postId: string;
  };
}> = ({ reaction }) => {
  let text = "";
  const addToText = (add: string) => (text += " " + add);
  if (reaction.type == "Agree") addToText("agreed with a post");
  if (reaction.type == "Disagree") addToText("disagreed with a post");
  if (reaction.type == "Love") addToText("loved a post");

  return (
    <>
      <div className="w-full rounded-lg border-l border-b border-gray-700 bg-gray-800 px-0 shadow-md shadow-gray-900 hover:bg-gray-700 xs:px-4">
        <Link href={PagesLinks.getPostLink(reaction.postId)}>
          <div className="py-2 text-gray-300">
            <h2>{text}</h2>
          </div>
          <div className="ml-1 flex rounded-lg border-l-2  border-gray-700 p-2">
            <h4 className="text-sm text-gray-100  opacity-95">
              {BadWordsFilter.clean(
                splitAndGetStartingString({ string: reaction.body })
              )}
            </h4>
          </div>
          <div className="my-1 flex items-center justify-end">
            <h2 className="text-xs opacity-70">
              {moment(reaction.createdAt).fromNow()}
            </h2>
          </div>
        </Link>
      </div>
    </>
  );
};
export default ReactionItem;
