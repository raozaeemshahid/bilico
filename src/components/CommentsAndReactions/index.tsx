import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import Loading from "../Loading";
import CompactNumberFormatter from "../../utils/CompactNumberFormatter";

const Reactions = dynamic(() => import("./Reactions"), {
  loading: () => <Loading />,
});
const Comments = dynamic(() => import("./Comments"), {
  loading: () => <Loading />,
});

const ReactionsAndComments: React.FC<{
  reactionsCount: number;
  commentsCount: number;
  postId: string;
  changeCommentCount: Dispatch<SetStateAction<number>>;
  highlightedCommentId?: string;
}> = ({ commentsCount, changeCommentCount, postId, reactionsCount, highlightedCommentId }) => {
  const [isReactionsPanelOpen, changeIsReactionsPanelOpen] = useState(false);
  const [isCommentsPanelOpen, changeIsCommentsPanelOpen] = useState(!!highlightedCommentId);

  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={() => {
            changeIsCommentsPanelOpen(false);
            changeIsReactionsPanelOpen((state) => !state);
          }}
          className="bg-transparent text-xs text-gray-200 opacity-80 hover:underline"
        >
          {CompactNumberFormatter.format(reactionsCount)} Reactions
        </button>
        <button
          onClick={() => {
            changeIsReactionsPanelOpen(false);
            changeIsCommentsPanelOpen((state) => !state);
          }}
          className="bg-transparent text-xs text-gray-200 opacity-80 hover:underline"
        >
          {CompactNumberFormatter.format(commentsCount)} Comments
        </button>
      </div>
      <div className="flex flex-wrap lg:flex-nowrap">
        {isReactionsPanelOpen && (
          <div className="m-1 my-2 w-full rounded-lg bg-gray-700 p-2 xs:m-3">
            <Reactions postId={postId} reactionsCount={reactionsCount} />
          </div>
        )}
        {isCommentsPanelOpen && (
          <div className="m-1 my-2 w-full rounded-lg bg-gray-700 p-2 xs:m-3">
            <Comments
              postId={postId}
              commentsCount={commentsCount}
              changeCommentCount={changeCommentCount}
              highlightedCommentId={highlightedCommentId}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default ReactionsAndComments;
