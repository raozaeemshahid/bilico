import { api } from "../../../../../utils/api";
import moment from "moment";
import Loading from "../../../../Loading";
import type { OrderOfDataByTime } from "../../../../../lib/common/names";
import FetchMoreInfiniteComponent from "../../../../FetchMoreInfiniteQueryComponent";
import dynamic from "next/dynamic";
import PostItem from "./PostItem";
import { toast } from "react-toastify";

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
  const utils = api.useContext();
  const deletePostApi = api.me.DeletePost.useMutation();

  if (!getPosts.data || !userData.data) return <Loading />;

  const deletePost = (postId: string) => {
    void toast
      .promise(deletePostApi.mutateAsync({ postId }), {
        error: "Couldn't Delete Post",
        pending: "Deleting Post",
        success: "Post Deleted Successfully",
      })
      .then(() => {
        void toast.promise(utils.me.getPosts.invalidate(), {
          error: "Couldn't Reload Posts",
          pending: "Reloading Posts",
          success: "Posts Reloaded",
        });
      });
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        {getPosts.data.pages.map((page) =>
          page.items.map((post) => (
            <PostItem
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
              }}
              userData={{
                image: userData.data.image,
                isVerified: userData.data.isVerified,
                name: userData.data.name,
              }}
              deletePost={deletePost}
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
