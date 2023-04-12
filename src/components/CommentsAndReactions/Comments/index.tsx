import { CommentType } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";
import SmallTabs from "../SmallTabs";
import CommentsComponent from "./Comments";
import CreateComment from "./CreateComment";
import SelectedCommentComponent from "./SelectedComment";
import { api } from "../../../utils/api";

export interface SelectedComment {
  Comment: string;
  _count: {
    Replies: number;
  };
  id: string;
  ReplyTo?: SelectedComment | undefined;
  CreatedBy: {
    id: string;
    name: string;
    image: string | null;
    isVerified: boolean;
  };
  CreatedAt: Date;
}

const Comments: React.FC<{
  postId: string;
  commentsCount: number;
  changeCommentCount: Dispatch<SetStateAction<number>>;
}> = ({ postId, commentsCount, changeCommentCount }) => {
  const [currentTab, changeCurrentTab] = useState<CommentType>("Opinion");
  const [selectedComment, changeSelectedComment] = useState<SelectedComment>();

  const [comment, changeComment] = useState("");
  useEffect(() => {
    changeComment("");
  }, [currentTab]);

  const count = api.publicApi.getCommentsCount.useQuery(
    { postId },
    { enabled: commentsCount > 0 }
  );

  if (!!selectedComment)
    return (
      <SelectedCommentComponent
        selectedComment={selectedComment}
        changeSelectedComment={changeSelectedComment}
      />
    );

  return (
    <>
      <div className="h-full rounded-lg py-2 md:px-3">
        <div className="flex items-center justify-center gap-2 rounded-lg border-b-4 border-gray-700 text-center text-sm">
          <SmallTabs<CommentType>
            changeCurrentTab={(id) => changeCurrentTab(id)}
            currentTab={currentTab}
            tabList={Object.values(CommentType)}
            count={count.data ? count.data : {}}
          />
        </div>
        <div className="py-3">
          <CreateComment
            changeCommentCount={changeCommentCount}
            changeComment={changeComment}
            comment={comment}
            currentTab={currentTab}
            postId={postId}
          />
        </div>
        <div className="my-2 mt-3">
          {commentsCount > 0 && (
            <div className="my-2 mt-3">
              {!!count.data && !!count.data[currentTab] && (
                <CommentsComponent
                  changeCommentCount={changeCommentCount}
                  postId={postId}
                  tab={currentTab}
                  changeSelectedComment={changeSelectedComment}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Comments;
