import { api } from "../../../../../utils/api";
import Loading from "../../../../Loading";
import type { OrderOfDataByTime } from "../../../../../lib/common/names";
import FetchMoreInfiniteComponent from "../../../../FetchMoreInfiniteQueryComponent";
import WorkItem from "./WorkItem";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ModalContext } from "../../../../../pages/_app";

const WorkListComponent: React.FC<{ order: OrderOfDataByTime }> = ({
  order,
}) => {
  const userData = api.me.data.useQuery();
  const getAllWork = api.publicApi.getAllWork.useInfiniteQuery(
    { limit: 10, order },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const utils = api.useContext();
  const deleteWorkApi = api.me.deleteWork.useMutation();
  const controlModal = useContext(ModalContext);

  if (!getAllWork.data || !userData.data) return <Loading />;

  const deleteWork = (workId: string) => {
    controlModal.changeModal({
      text: "Are you sure you want to delete this work?",
      confirmText: "Delete",
      confirm: () => {
        void toast.promise(
          deleteWorkApi
            .mutateAsync({ workId })
            .then(() => utils.publicApi.getAllWork.invalidate({ order })),
          {
            error: "Couldn't Delete",
            pending: "Deleting",
            success: "Deleted Successfully",
          }
        );
      },
    });
  };
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
              deleteWork={deleteWork}
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
