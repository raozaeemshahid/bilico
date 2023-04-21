import { api } from "../../../utils/api";
import Loading from "../../Loading";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";
import { useEffect } from "react";
import NotificationItem from "./NotificationItem";

const NotificationsListComponent: React.FC = () => {
  const userInfo = api.me.info.useQuery();
  const getNotifications = api.me.getNotifications.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const hasNotificationsApi = api.me.hasSeenNotifications.useMutation();

  useEffect(() => {
    if (!userInfo.data || !userInfo.data.success) return;
    if (!getNotifications) return;
    if (userInfo.data.newNotifications > 0) {
      setTimeout(() => {
        hasNotificationsApi.mutate();
      }, 1000);
    }
  }, [getNotifications.isSuccess, userInfo.isSuccess]);

  if (!getNotifications.data) return <Loading />;

  return (
    <>
      <div className="flex gap-2 flex-col">
        {getNotifications.data.pages.map((page) =>
          page.items.map((request) => (
            <NotificationItem key={request.id} {...request} />
          ))
        )}
        <FetchMoreInfiniteComponent
          fetchNextPage={() => void getNotifications.fetchNextPage()}
          hasNextPage={getNotifications.hasNextPage}
          isFetchingNextPage={getNotifications.isFetchingNextPage}
          endingMsg="You're all caught up!"
        />
      </div>
    </>
  );
};

export default NotificationsListComponent;
