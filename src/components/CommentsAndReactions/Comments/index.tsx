import { CommentType } from "@prisma/client";
import { useEffect, useState } from "react";
import SmallTabs from "../SmallTabs";
import CommentsComponent from "./Comments";
import CreateComment from "./CreateComment";
import SelectedCommentComponent from "./SelectedComment";

export interface SelectedComment {
  Comment: string;
  _count: {
    Replies: number;
  };
  id: string;
  CreatedBy: {
    id: string;
    name: string;
    image: string | null;
    isVerified: boolean;
  };
  CreatedAt: Date;
  LovedByAuthor: boolean;
}

const Comments: React.FC<{ postId: string }> = ({ postId }) => {
  const [currentTab, changeCurrentTab] = useState<CommentType>("Agree");
  const [selectedComment, changeSelectedComment] = useState<SelectedComment>();

  const [comment, changeComment] = useState("");
  useEffect(() => {
    changeComment("");
  }, [currentTab]);
  if (!!selectedComment)
    return (
      <SelectedCommentComponent
        commentId={selectedComment.id}
        changeSelectedComment={changeSelectedComment}
      />
    );

  return (
    <>
      <div className="h-full rounded-lg py-2 md:px-3">
        <div className="flex items-center justify-center gap-2 rounded-lg border-b-4 border-gray-700 text-center text-sm">
          <h2 className="block text-center text-lg font-bold 2sm:hidden">
            Comments
          </h2>
          <SmallTabs<CommentType>
            changeCurrentTab={(id) => changeCurrentTab(id)}
            currentTab={currentTab}
            tabList={Object.values(CommentType)}
          />
        </div>
        <div className="my-2 mt-3">
          <CommentsComponent
            postId={postId}
            tab={currentTab}
            changeSelectedComment={changeSelectedComment}

          />
        </div>
        <div className="pb-3">
        <CreateComment
          changeComment={changeComment}
          comment={comment}
          currentTab={currentTab}
          postId={postId}
        />
        </div>
      </div>
    </>
  );
};
export default Comments;
