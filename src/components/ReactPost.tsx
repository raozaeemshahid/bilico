import { Reaction } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { UserIdContext } from "./Profile";
import { api } from "../utils/api";

const ReactComponent: React.FC<{
  reaction: Reaction;
  isActive: boolean;
  isConfirming: boolean;
  reactPost: (reaction: Reaction) => void;
}> = ({ reaction, isActive, isConfirming, reactPost }) => {
  let text;
  if (isActive && isConfirming) text = "Un-" + reaction + "?";
  if (!isActive && isConfirming) text = reaction + "-ing?";
  if (isActive && !isConfirming) text = reaction + "-ed";
  if (!isActive && !isConfirming) text = reaction;

  return (
    <button
      className={`border-collapse ${isConfirming && "bg-gray-700"} ${
        isActive && "bg-gray-900"
      } rounded-lg border border-gray-500 py-1 px-4 text-sm font-semibold text-gray-200 shadow-md shadow-gray-900 xs:w-full`}
      onClick={() => reactPost(reaction)}
    >
      {text}
    </button>
  );
};

const ReactPostComponent: React.FC<{
  reactionByVisitor?: { id: string; Reaction: Reaction };
  postId: string;
}> = ({ reactionByVisitor, postId }) => {
  const userId = useContext(UserIdContext);
  const reactPostApi = api.publicApi.reactPost.useMutation({
    onSuccess(data) {
      if (data) {
        changeReaction({ Reaction: data.Reaction, id: data.id });
      }
    },
  });

  const [reaction, changeReaction] = useState(reactionByVisitor);

  const [confirming, changeConfirming] = useState<Reaction>();
  const [active, changeActive] = useState<Reaction>();
  useEffect(() => {
    if (reactionByVisitor) changeActive(reactionByVisitor.Reaction);
  }, []);

  const reactPost = (newReaction: Reaction) => {
    if (confirming && confirming !== newReaction)
      // unselect selected reaction to not confirm
      return changeConfirming(undefined);
    if (!confirming || confirming !== newReaction) {
      // select a reaction to confirm
      return changeConfirming(newReaction);
    }
    // user has confirmed which reaction to give
    changeConfirming(undefined);
    if (newReaction == active) {
      // removing the reactions
      changeActive(undefined);
      reactPostApi.mutate({ postId, previousReactionId: reaction?.id });
    } else {
      // upserting reaction
      changeActive(newReaction);
      reactPostApi.mutate({
        postId,
        previousReactionId: reaction?.id,
        reaction: newReaction,
      });
    }
  };

  return (
    <>
      <div className="my-1 mt-3 flex w-full flex-wrap justify-center xs:flex-nowrap">
        {Object.values(Reaction).map((r) => (
          <ReactComponent
            reaction={r}
            isActive={!!active && active == r}
            isConfirming={!!confirming && confirming == r}
            reactPost={reactPost}
          />
        ))}
      </div>
    </>
  );
};
export default ReactPostComponent;
