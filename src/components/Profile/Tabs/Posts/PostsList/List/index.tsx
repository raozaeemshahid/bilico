import { api } from "../../../../../../utils/api";
import Loading from "../../../../../Loading";
import type { OrderOfDataByTime } from "../../../../../../lib/common/names";
import FetchMoreInfiniteComponent from "../../../../../FetchMoreInfiniteQueryComponent";
import { UserIdContext } from "../../../..";
import { useContext } from "react";
import Post from "./Post";


const PostsListComponent: React.FC<{ order: OrderOfDataByTime }> = ({
  order,
}) => {
  const userId = useContext(UserIdContext);
  const userData = api.publicApi.getProfile.useQuery({ userId });
  const getPosts = api.publicApi.getUserPosts.useInfiniteQuery(
    { limit: 10, order, userId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!getPosts.data || !userData.data || !userData.data.success)
    return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-4">
        {getPosts.data.pages.map((page) =>
          page.items.map((post) => (
            <Post
              key={post.id}
              post={{
                _count: {
                  comments: post._count.Comments,
                  reactions: post._count.Reactions,
                },
                body: post.Body,
                createdAt: post.CreatedAt,
                id: post.id,
                interests: post.Interests,
                reactionByVisitor: post.Reactions[0],
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
          fetchNextPage={() => void getPosts.fetchNextPage()}
          hasNextPage={getPosts.hasNextPage}
          isFetchingNextPage={getPosts.isFetchingNextPage}
          endingMsg=""
        />
      </div>
    </>
  );
};

export default PostsListComponent;
