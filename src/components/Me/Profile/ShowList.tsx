import Image from "next/image";

import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { api } from "../../../utils/api";
import { ProfileNumbersListTexts } from ".";
import PagesLinks from "../../../lib/PagesLink";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";
import type { Dispatch, SetStateAction } from "react";
import Loading from "../../Loading";

const ShowList: React.FC<{
  list: ProfileNumbersListTexts;
  count: number;
  changeShowList: Dispatch<
    SetStateAction<
      | {
          list: ProfileNumbersListTexts;
          count: number;
        }
      | undefined
    >
  >;
}> = ({ list, count, changeShowList }) => {
  const getList = api.me.getList.useInfiniteQuery(
    { limit: 20, list },
    {
      enabled: list !== "Posts" && count > 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  if (list == "Posts") return <></>;

  return (
    <>
      <div className="w-full rounded-lg border-2 border-gray-400 bg-gray-800  p-2">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-lg text-gray-200">
            {list == "Trusted" ? "Trusted By" : list}
          </h2>
          <div
            onClick={() => changeShowList(undefined)}
            className="flex cursor-pointer justify-end text-gray-200 hover:text-gray-300"
          >
            X
          </div>
        </div>
        {!getList.data && count > 0 && <Loading />}
        {!!getList.data && (
          <div className="flex flex-col">
            {getList.data.pages.map((page) =>
              page.items.map((user) => (
                <Link key={user.id} href={PagesLinks.getProfileLink(user.id)}>
                  <div className="w-full rounded-lg py-2 px-4 hover:bg-gray-700">
                    <div className="">
                      <div className="flex flex-nowrap items-center gap-3">
                        <div>
                          {!!user.image && (
                            <Image
                              alt="Profile Pic"
                              className="rounded-full"
                              width={32}
                              height={32}
                              src={user.image}
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-md flex items-center gap-1 text-sm">
                            <h3 className="whitespace-nowrap">{user.name}</h3>
                            <h3>{user.isVerified && <MdVerified />}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
            <FetchMoreInfiniteComponent
              fetchNextPage={() => void getList.fetchNextPage()}
              hasNextPage={getList.hasNextPage}
              isFetchingNextPage={getList.isFetchingNextPage}
              endingMsg=""
            />
          </div>
        )}
      </div>
    </>
  );
};
export default ShowList;
