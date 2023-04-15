import type { CommentType } from "@prisma/client";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import type { SelectedComment } from ".";
import Loading from "../../Loading";
import { api } from "../../../utils/api";
import CommentItem from "./CommentItem";
import { toast } from "react-toastify";
import { ModalContext } from "../../../pages/_app";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";
import {
  listOrderOfDataByTime,
  OrderOfDataByTime,
} from "../../../lib/common/names";
import Select from "react-select";

const CommentsComponent: React.FC<{
  postId: string;
  tab: CommentType;
  changeCommentCount: Dispatch<SetStateAction<number>>;
  changeSelectedComment: Dispatch<SetStateAction<SelectedComment | undefined>>;
}> = ({ tab, postId, changeSelectedComment, changeCommentCount }) => {
  const [order, changeOrder] = useState<OrderOfDataByTime>("Oldest");
  const getComments = api.publicApi.getComments.useInfiniteQuery(
    { limit: 10, postId, commentType: tab, order },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const deleteCommentApi = api.publicApi.deleteComment.useMutation();
  const utils = api.useContext();
  const controlModal = useContext(ModalContext);
  const deleteComment = (commentId: string) => {
    controlModal.changeModal({
      text: "Are you sure you want to delete this comment?",
      confirmText: "Delete",
      confirm: () => {
        void toast
          .promise(
            deleteCommentApi.mutateAsync({ commentId }).then(() =>
              Promise.all([
                utils.publicApi.getComments.invalidate({
                  postId,
                  commentType: tab,
                }),
                utils.publicApi.getCommentsCount.invalidate({ postId }),
              ])
            ),
            {
              error: "Couldn't Delete Comment",
              pending: "Deleting Comment",
              success: "Comment Deleted Successfully",
            }
          )
          .then(() => {
            changeCommentCount((count) => count - 1);
          });
      },
    });
  };
  if (!getComments.data) return <Loading />;

  return (
    <>
      <div className="flex items-center gap-2">
        <h2>Order by</h2>
        <Select
          className="basic-single"
          styles={{
            control: (style) => ({
              ...style,
              border: "0px",
              backgroundColor: "transparent",
            }),
            singleValue: (style) => ({ ...style, color: "white" }),
          }}
          classNamePrefix="select"
          defaultValue={{ label: order }}
          isClearable={false}
          isSearchable={false}
          name="order-select"
          onChange={(data) => {
            if (!data || !data.label) return;
            changeOrder(data.label);
          }}
          options={listOrderOfDataByTime.map((order) => ({ label: order }))}
        />
      </div>
      <div className="flex flex-col gap-1">
        {getComments.data.pages.map((page) =>
          page.items.map((comment) => (
            <CommentItem
              key={comment.id}
              deleteComment={deleteComment}
              comment={{
                _count: { replies: comment._count.Replies },
                body: comment.Comment,
                createdAt: comment.CreatedAt,
                id: comment.id,
              }}
              userData={{
                id: comment.CreatedBy.id,
                image: comment.CreatedBy.image,
                isVerified: comment.CreatedBy.isVerified,
                name: comment.CreatedBy.name,
              }}
              changeSelectedComment={changeSelectedComment}
              theme="Dark"
            />
          ))
        )}
      </div>
      <FetchMoreInfiniteComponent
        fetchNextPage={() => void getComments.fetchNextPage()}
        hasNextPage={getComments.hasNextPage}
        isFetchingNextPage={getComments.isFetchingNextPage}
        endingMsg=""
      />
    </>
  );
};
export default CommentsComponent;
