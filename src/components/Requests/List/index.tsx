import Request from "./RequestItem";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";
import { useEffect } from "react";
import type { OrderOfDataByTime } from "../../../lib/common/names";

const RequestsListComponent: React.FC<{ order: OrderOfDataByTime }> = ({
  order,
}) => {
  const userInfo = api.me.info.useQuery();
  const getConnectionRequests = api.me.getConnectionRequests.useInfiniteQuery(
    { limit: 20, order },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const hasSeenRequestsApi = api.me.hasSeenConnectionRequests.useMutation();

  useEffect(() => {
    if (!userInfo.data || !userInfo.data.success) return;
    if (!getConnectionRequests) return;
    if (userInfo.data.newRequests > 0) {
      setTimeout(() => {
        hasSeenRequestsApi.mutate();
      }, 1000);
    }
  }, [getConnectionRequests.isSuccess, userInfo.isSuccess]);

  if (!getConnectionRequests.data) return <Loading />;

  return (
    <>
      <div className="flex flex-col">
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

export default RequestsListComponent;
