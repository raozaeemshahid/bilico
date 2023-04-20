import { api } from "../../../utils/api";
import Loading from "../../Loading";
import type { OrderOfDataByTime } from "../../../lib/common/names";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";
import CommentItem from "./CommentItem";
import type { AllCommentType } from "../../../server/api/routers/me/getCommentsActivity";
import { useSession } from "next-auth/react";

const CommentListComponent: React.FC<{
  order: OrderOfDataByTime;
  filter: AllCommentType;
}> = ({ order, filter }) => {
  const {data: userSession} = useSession()
  const getComments = api.me.getCommentsActivity.useInfiniteQuery(
    { limit: 20, order, filter },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!getComments.data || !userSession || !userSession.user) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-4">
        {getComments.data.pages.map((page) =>
          page.items.map((comment) => (
            <CommentItem
              key={comment.id}
              image={userSession.user?.image}
              comment={{
                body: comment.Comment,
                createdAt: comment.CreatedAt,
                id: comment.id,
                postId: comment.postId,
                replyToCommentId: comment.replyToCommentId,
                type: comment.CommentType,
              }}
            />
          ))
        )}
        <FetchMoreInfiniteComponent
          fetchNextPage={() => void getComments.fetchNextPage()}
          hasNextPage={getComments.hasNextPage}
          isFetchingNextPage={getComments.isFetchingNextPage}
          endingMsg=""
        />
      </div>
    </>
  );
};

export default CommentListComponent;
