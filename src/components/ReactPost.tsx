import { Reaction } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { AiFillLike, AiFillDislike, AiFillHeart } from "react-icons/ai";

const ReactComponent: React.FC<{
  reaction: Reaction;
  isActive: boolean;
  isConfirming: boolean;
  reactPost: (reaction: Reaction) => void;
}> = ({ reaction, isActive, isConfirming, reactPost }) => {
  let text;
  if (isActive && isConfirming) text = "Un" + reaction.toLowerCase() + "?";
  if (!isActive && isConfirming) {
    if (reaction == "Love") text = "Loving?";
    else text = reaction + "ing?";
  }
  if (isActive && !isConfirming) text = reaction + "d";
  if (!isActive && !isConfirming) text = reaction;

  return (
    <button
      className={`flex border-collapse items-center justify-center gap-2 py-[5px] ${
        isConfirming ? "bg-gray-700" : ""
      } ${
        isActive ? "bg-gray-900" : ""
      } rounded-lg border border-gray-500 py-1 px-4 text-sm font-semibold text-gray-200 shadow-md shadow-gray-900 xs:w-full`}
      onClick={() => reactPost(reaction)}
    >
      {isActive && (
        <>
          {reaction == "Agree" && <AiFillLike />}
          {reaction == "Disagree" && <AiFillDislike />}
          {reaction == "Love" && <AiFillHeart />}
        </>
      )}
      {text}
    </button>
  );
};

// stack of requests to not overload or confust server, and send request in sequence to mutate.
const stackOfMutationsToReact: (Reaction | undefined)[] = [];

const ReactPostComponent: React.FC<{
  reactionByVisitor?: { id: string; Reaction: Reaction };
  postId: string;
}> = ({ reactionByVisitor, postId }) => {
  const reactPostApi = api.publicApi.reactPost.useMutation({
    onSuccess(data) {
      if (data) {
        changeReaction({ Reaction: data.Reaction, id: data.id });
      }
      const nextReaction = stackOfMutationsToReact.shift();
      // if there's another request pending....
      if (nextReaction)
        reactPostApi.mutate({
          postId,
          previousReactionId: data?.id,
          reaction: nextReaction,
        });
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
    let nextReaction: Reaction | undefined;
    changeConfirming(undefined);
    if (newReaction == active) {
      // removing the reactions
      changeActive(undefined);
      nextReaction = undefined
    } else {
      // upserting reaction
      changeActive(newReaction);
      nextReaction = newReaction
    }
    if (reactPostApi.isLoading || stackOfMutationsToReact.length > 0) {
      stackOfMutationsToReact.push(nextReaction);
      return;
    }
    reactPostApi.mutate({postId, previousReactionId: reaction?.id, reaction: nextReaction});
  };

  return (
    <>
      <div className="my-1 mt-3 flex w-full flex-wrap justify-center xs:flex-nowrap">
        {Object.values(Reaction).map((r) => (
          <ReactComponent
            key={r}
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
