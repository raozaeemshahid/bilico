import { AllReactions } from ".";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import Image from "next/image";

import { MdVerified } from "react-icons/md";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";

const ReactionsComponent: React.FC<{ postId: string; tab: AllReactions }> = ({
  postId,
  tab,
}) => {
  const getReactions = api.publicApi.getReactions.useInfiniteQuery(
    { limit: 20, postId, reaction: tab },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  if (!getReactions.data) return <Loading />;

  return (
    <>
      <div className="flex flex-col">
        {getReactions.data.pages.map((page) =>
          page.items.map((reaction) => (
            <div
              key={reaction.id}
              className="w-full rounded-lg py-2 hover:bg-gray-800 px-0 xs:px-4 my-1 sm:mx-2"
            >
              <div className="">
                <div className="flex flex-nowrap items-center gap-3">
                  <div>
                    {!!reaction.FromUser.image && (
                      <Image
                        alt="Profile Pic"
                        className="rounded-full"
                        width={40}
                        height={40}
                        src={reaction.FromUser.image}
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-md flex items-center gap-1 sm:text-base">
                      <h3 className="whitespace-nowrap">{reaction.FromUser.name}</h3>
                      <h3>{reaction.FromUser.isVerified && <MdVerified />}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
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
export default ReactionsComponent;
