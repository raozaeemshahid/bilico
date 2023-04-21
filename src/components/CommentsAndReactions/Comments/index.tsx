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
  highlightedComment?: SelectedComment | undefined;
  CommentType?: CommentType | null;
  CreatedBy: {
    id: string;
    name: string;
    image: string | null;
    isVerified: boolean;
  };
  CreatedAt: Date;
}

let isSelectedHighlightedComment = false;
let isSelectedMainHighlightedComment = false;
let lastHighlightedCommentId = "";

const Comments: React.FC<{
  postId: string;
  commentsCount: number;
  changeCommentCount: Dispatch<SetStateAction<number>>;
  highlightedCommentId?: string;
}> = ({ postId, commentsCount, changeCommentCount, highlightedCommentId }) => {
  const [currentTab, changeCurrentTab] = useState<CommentType>("Opinion");
  const [selectedComment, changeSelectedComment] = useState<SelectedComment>();
  const [highlightedComment, changeHighlightedComment] =
    useState<SelectedComment>();

  api.publicApi.getHighlightedComment.useQuery(
    { commentId: highlightedCommentId || "" },
    {
      enabled: !!highlightedCommentId,
      onSuccess: (data) => {
        if (
          highlightedCommentId &&
          highlightedCommentId !== lastHighlightedCommentId
        ) {
          isSelectedHighlightedComment = false;
          lastHighlightedCommentId = highlightedCommentId;
        }
        if (isSelectedHighlightedComment) return;
        isSelectedHighlightedComment = true;
        changeSelectedComment(data.selectedComment);
      },
    }
  );
  useEffect(() => {
    return () => {
      isSelectedHighlightedComment = false;
    };
  }, []);

  useEffect(() => {
    // set highlighted comment when user go back from all replies
    // to keep comment highlighted among all other comments
    if (!selectedComment) return;
    if (selectedComment.CommentType)
      changeCurrentTab(selectedComment.CommentType);
    if (!selectedComment.ReplyTo) {
      if (highlightedComment && highlightedComment !== selectedComment)
        changeHighlightedComment(undefined);
      if (isSelectedMainHighlightedComment) return;
      isSelectedMainHighlightedComment = true;
      changeHighlightedComment(selectedComment);
    }
  }, [selectedComment]);

  const [comment, changeComment] = useState("");
  useEffect(() => {
    changeHighlightedComment(undefined);
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
                  highlightedComment={highlightedComment}
                  changeHighlightedComment={changeHighlightedComment}
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
