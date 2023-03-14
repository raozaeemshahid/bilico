import { AllReactions } from ".";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import Image from "next/image";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineHeart,
} from "react-icons/ai";

import { MdVerified } from "react-icons/md";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";

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
            <Link
              key={reaction.id}
              href={PagesLinks.getProfileLink(reaction.FromUser.id)}
            >
              <div className="w-full rounded-lg py-2 px-4 hover:bg-gray-800">
                <div className="">
                  <div className="flex flex-nowrap items-center gap-3">
                    <div>
                      {!!reaction.FromUser.image && (
                        <Image
                          alt="Profile Pic"
                          className="rounded-full"
                          width={32}
                          height={32}
                          src={reaction.FromUser.image}
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-md flex items-center gap-1 text-sm">
                        <h3 className="whitespace-nowrap">
                          {reaction.FromUser.name}
                        </h3>
                        <h3>
                          {reaction.FromUser.isVerified && <MdVerified />}
                        </h3>
                        {tab == "All" && (
                          <>
                            {reaction.Reaction == "Agree" && <AiOutlineLike />}
                            {reaction.Reaction == "Disagree" && (
                              <AiOutlineDislike />
                            )}
                            {reaction.Reaction == "Love" && <AiOutlineHeart />}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
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
