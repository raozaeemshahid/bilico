import { useState } from "react";
import dynamic from "next/dynamic";
import Loading from "../Loading";
import { Reaction } from "@prisma/client";
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
}> = ({ commentsCount, postId, reactionsCount }) => {
  const [isReactionsPanelOpen, changeIsReactionsPanelOpen] = useState(false);
  const [isCommentsPanelOpen, changeIsCommentsPanelOpen] = useState(false);

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
          {reactionsCount} Reactions
        </button>
        <button
          onClick={() => {
            changeIsReactionsPanelOpen(false);
            changeIsCommentsPanelOpen((state) => !state);
          }}
          className="bg-transparent text-xs text-gray-200 opacity-80 hover:underline"
        >
          {commentsCount} Comments
        </button>
      </div>
      <div className="flex flex-wrap lg:flex-nowrap">
        {isReactionsPanelOpen && (
          <div className="m-1 my-2 max-h-72 w-full overflow-y-auto rounded-lg bg-gray-700 p-2 xs:m-3">
            <Reactions postId={postId} />
          </div>
        )}
        {isCommentsPanelOpen && (
          <div className="m-1 my-2 max-h-72 w-full overflow-y-auto rounded-lg bg-gray-700 p-2 xs:m-3">
            <Comments postId={postId} />
          </div>
        )}
      </div>
    </>
  );
};
export default ReactionsAndComments;
