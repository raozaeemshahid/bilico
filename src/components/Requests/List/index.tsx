import Request from "./RequestItem";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";

const PostsListComponent: React.FC = () => {
  const getConnectionRequests = api.me.getConnectionRequests.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!getConnectionRequests.data) return <Loading text="Loading Data" />;

  return (
    <>
      <div className="flex flex-col gap-4">
        {getConnectionRequests.data.pages.map((page) =>
          page.items.map((request) => (
            <Request
              key={request.id}
              request={{
                message: request.message,
                createdAt: request.createdAt,
                id: request.id,
                isSeen: request.isSeen,
              }}
              userData={{
                id: request.Sender.id,
                image: request.Sender.image,
                isVerified: request.Sender.isVerified,
                name: request.Sender.name,
                Bio: request.Sender.Bio,
              }}
            />
          ))
        )}
        <FetchMoreInfiniteComponent
          fetchNextPage={() => void getConnectionRequests.fetchNextPage()}
          hasNextPage={getConnectionRequests.hasNextPage}
          isFetchingNextPage={getConnectionRequests.isFetchingNextPage}
          endingMsg="You're all caught up!"
        />
      </div>
    </>
  );
};

export default PostsListComponent;
