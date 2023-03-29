import { useState } from "react";
import { Reaction } from "@prisma/client";
import SmallTabs from "../SmallTabs";

import ReactionsComponent from "./Reactions";
import { api } from "../../../utils/api";
import Loading from "../../Loading";

export type AllReactions = "All" | Reaction;
export const AllReactions: AllReactions[] = [
  "All",
  "Agree",
  "Disagree",
  "Love",
];

const Reactions: React.FC<{ postId: string; reactionsCount: number }> = ({
  postId,
  reactionsCount,
}) => {
  const [currentTab, changeCurrentTab] = useState<AllReactions>("All");
  const count = api.publicApi.getReactionsCount.useQuery(
    { postId },
    { enabled: reactionsCount > 0 }
  );

  return (
    <>
      <div className="rounded-lg md:px-3">
        <div className="flex items-center justify-center gap-2 rounded-lg border-b-4 border-gray-700 text-center text-sm">
          <h2 className="block text-center text-lg font-bold 2sm:hidden">
            Reactions
          </h2>
          <SmallTabs<AllReactions>
            changeCurrentTab={(id) => changeCurrentTab(id)}
            currentTab={currentTab}
            tabList={AllReactions}
            count={
              count.data
                ? {
                    All: Object.values(count.data).reduce(
                      (partialSum, a) => partialSum + a,
                      0
                    ),
                    ...count.data,
                  }
                : {}
            }
          />
        </div>
        {!!count.data && reactionsCount > 0 && (
          <div className="my-2 mt-3">
            {(currentTab == "All"
              ? reactionsCount > 0
              : !!count.data[currentTab]) && (
              <ReactionsComponent postId={postId} tab={currentTab} />
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default Reactions;
