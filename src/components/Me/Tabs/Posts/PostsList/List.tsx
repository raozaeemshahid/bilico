import { api } from "../../../../../utils/api";
import BadWordsFilter from "../../../../../utils/BadWordFilter";
import moment from "moment";
import Image from "next/image";
import Loading from "../../../../Loading";
import type { OrderOfDataByTime } from "../../../../../lib/common/names";
import FetchMoreInfiniteComponent from "../../../../FetchMoreInfiniteQueryComponent";
import dynamic from "next/dynamic";
import ReactionsAndComments from "../../../../CommentsAndReactions"; 

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const PostsListComponent: React.FC<{ order: OrderOfDataByTime }> = ({
  order,
}) => {
  const userData = api.me.data.useQuery();
  const getPosts = api.me.getPosts.useInfiniteQuery(
    { limit: 10, order },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!getPosts.data || !userData.data) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-4">
        {getPosts.data.pages.map((page) =>
          page.items.map((post) => (
            <div
              key={post.id}
              className="w-full rounded-lg border-b border-gray-400 bg-gray-800 py-3 px-0 xs:px-4 sm:m-2"
            >
              <div className="">
                <div className="flex items-center gap-3">
                  <div>
                    {!!userData.data.image && (
                      <Image
                        alt="Profile Pic"
                        className="rounded-full"
                        width={40}
                        height={40}
                        src={userData.data.image}
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-md flex items-center gap-1 sm:text-base">
                      <h3>{userData.data.name}</h3>
                      <h3>{userData.data.isVerified && <MdVerified />}</h3>
                    </div>
                    <h3 className="text-sm text-gray-100 opacity-80">
                      {moment(post.CreatedAt).fromNow()}
                    </h3>
                  </div>
                </div>
                <h4 className="m-2 my-4 text-base">
                  {BadWordsFilter.clean(post.Body)}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {post.Interests.map((interest) => (
                    <h3
                      className="whitespace-nowrap rounded-lg bg-green-700 p-1 px-3 text-xs"
                      key={interest.id}
                    >
                      {interest.title}
                    </h3>
                  ))}
                </div>
                <div className="mt-3">
                  <ReactionsAndComments
                    commentsCount={post._count.Comments}
                    postId={post.id}
                    reactionsCount={post._count.Reactions}
                  />
                </div>
              </div>
            </div>
          ))
        )}
        <FetchMoreInfiniteComponent
          fetchNextPage={() => void getPosts.fetchNextPage()}
          hasNextPage={getPosts.hasNextPage}
          isFetchingNextPage={getPosts.isFetchingNextPage}
          endingMsg="You're all caught up!"
        />
      </div>
    </>
  );
};

export default PostsListComponent;
