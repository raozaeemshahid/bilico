import { api } from "../../../utils/api";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";
import Loading from "../../Loading";
import { PostsInTab } from "../Home";
import Post from "./Post";

const Posts: React.FC<{ postsInTab: PostsInTab }> = ({ postsInTab }) => {
  const getHomePosts = api.publicApi.getHomePosts.useInfiniteQuery(
    { limit: 20, postsIn: postsInTab },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!getHomePosts.data) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-4">
        {getHomePosts.data.pages.map((page) =>
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
                id: post.CreatedBy.id,
                image: post.CreatedBy.image,
                isVerified: post.CreatedBy.isVerified,
                name: post.CreatedBy.name,
              }}
            />
          ))
        )}
        <FetchMoreInfiniteComponent
          fetchNextPage={() => void getHomePosts.fetchNextPage()}
          hasNextPage={getHomePosts.hasNextPage}
          isFetchingNextPage={getHomePosts.isFetchingNextPage}
          endingMsg=""
        />
      </div>
    </>
  );
};
export default Posts;
