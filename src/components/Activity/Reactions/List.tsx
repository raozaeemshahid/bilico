import { api } from "../../../utils/api";
import Loading from "../../Loading";
import type { OrderOfDataByTime } from "../../../lib/common/names";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";
import ReactionItem from "./ReactionItem";
import { AllReactions } from "../../CommentsAndReactions/Reactions";

const ReactionListComponent: React.FC<{
  order: OrderOfDataByTime;
  filter: AllReactions;
}> = ({ order, filter }) => {
  const getReactions = api.me.getReactionsActivity.useInfiniteQuery(
    { limit: 20, order, filter },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!getReactions.data) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-4">
        {getReactions.data.pages.map((page) =>
          page.items.map((reaction) => {
            if (!reaction.ToPost) return null
            return <ReactionItem
              key={reaction.id}
              reaction={{
                body: reaction.ToPost.Body,
                createdAt: reaction.CreatedAt,
                id: reaction.id,
                postId: reaction.ToPost.id,
                type: reaction.Reaction,
              }}
            />
          })
        )}
        <FetchMoreInfiniteComponent
          fetchNextPage={() => void getReactions.fetchNextPage()}
          hasNextPage={getReactions.hasNextPage}
          isFetchingNextPage={getReactions.isFetchingNextPage}
          endingMsg=""
        />
      </div>
    </>
  );
};

export default ReactionListComponent;
