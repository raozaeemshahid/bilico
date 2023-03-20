import { CommentType } from "@prisma/client";
import { useState } from "react";
import SmallTabs from "../SmallTabs";
import CommentsComponent from "./Comments";

const Comments: React.FC<{ postId: string }> = ({postId}) => {
  const [currentTab, changeCurrentTab] = useState<CommentType>("Agree");

  return (
    <>
      <div className="rounded-lg md:px-3">
        <div className="flex items-center justify-center gap-2 rounded-lg border-b-4 border-gray-700 text-center text-sm">
          <h2 className="block text-center text-lg font-bold 2sm:hidden">
            Reactions
          </h2>
          <SmallTabs<CommentType>
            changeCurrentTab={(id) => changeCurrentTab(id)}
            currentTab={currentTab}
            tabList={Object.values(CommentType)}
          />
        </div>
        <div className="my-2 mt-3">
          <CommentsComponent postId={postId} tab={currentTab} />
        </div>
      </div>
    </>
  );
};
export default Comments;
