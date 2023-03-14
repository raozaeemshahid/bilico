import { useState } from "react";
import { Reaction } from "@prisma/client";
import SmallTabs from "../SmallTabs";

import ReactionsComponent from "./Reactions";

export type AllReactions = "All" | Reaction;
export const AllReactions: AllReactions[] = [
  "All",
  "Agree",
  "Disagree",
  "Love",
];

const Reactions: React.FC<{ postId: string }> = ({ postId }) => {
  const [currentTab, changeCurrentTab] = useState<AllReactions>("All");

  return (
    <>
      <div className="rounded-lg md:px-3">
        <div className="rounded-lg flex items-center gap-2 justify-center border-b-4 border-gray-700 text-center text-sm">
          <h2 className="block 2sm:hidden text-center text-lg font-bold">Reactions</h2>
          <SmallTabs<AllReactions>
            changeCurrentTab={(id) => changeCurrentTab(id)}
            currentTab={currentTab}
            tabList={AllReactions}
          />
        </div>
        <div className="my-2 mt-3">
          <ReactionsComponent postId={postId} tab={currentTab} />
        </div>
      </div>
    </>
  );
};
export default Reactions;
