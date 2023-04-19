import { api } from "../../../../../utils/api";
import Loading from "../../../../Loading";
import type { OrderOfDataByTime } from "../../../../../lib/common/names";
import FetchMoreInfiniteComponent from "../../../../FetchMoreInfiniteQueryComponent";
import WorkItem from "./WorkItem";
import { useContext } from "react";
import { UserIdContext } from "../../..";

const WorkListComponent: React.FC<{ order: OrderOfDataByTime }> = ({
  order,
}) => {
  const userId = useContext(UserIdContext);
  const userData = api.publicApi.getProfile.useQuery({ userId });
  const getAllWork = api.publicApi.getAllWork.useInfiniteQuery(
    { limit: 10, order, userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!getAllWork.data || !userData.data) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-4">
        {getAllWork.data.pages.map((page) =>
          page.items.map((Work) => (
            <WorkItem
              key={Work.id}
              work={{
                body: Work.Body,
                createdAt: Work.CreatedAt,
                id: Work.id,
              }}
              userData={{
                image: userData.data.image,
                isVerified: userData.data.isVerified,
                name: userData.data.name,
              }}
            />
          ))
        )}
        <FetchMoreInfiniteComponent
          fetchNextPage={() => void getAllWork.fetchNextPage()}
          hasNextPage={getAllWork.hasNextPage}
          isFetchingNextPage={getAllWork.isFetchingNextPage}
          endingMsg=""
        />
      </div>
    </>
  );
};

export default WorkListComponent;
