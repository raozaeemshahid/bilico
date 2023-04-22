import { api } from "../../../../../utils/api";
import Loading from "../../../../Loading";
import type { OrderOfDataByTime } from "../../../../../lib/common/names";
import FetchMoreInfiniteComponent from "../../../../FetchMoreInfiniteQueryComponent";
import PostItem from "./PostItem";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ModalContext } from "../../../../../pages/_app";

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
  const deletePostApi = api.me.deletePost.useMutation();
  const controlModal = useContext(ModalContext);

  if (!getPosts.data || !userData.data) return <Loading />;

  const deletePost = (postId: string) => {
    controlModal.changeModal({
      text: "Delete this Post?",
      confirmText: "Delete",
      confirm: () => {
        void toast.promise(
          deletePostApi
            .mutateAsync({ postId })
            .then(() => utils.me.getPosts.invalidate({ order })),
          {
            error: "Couldn't Delete Post",
            pending: "Deleting Post",
            success: "Post Deleted Successfully",
          }
        );
      },
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
