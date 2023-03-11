import { api } from "../../../../../../utils/api";
import BadWordsFilter from "../../../../../../utils/BadWordFilter";
import moment from "moment";
import Image from "next/image";
import Loading from "../../../../../Loading";
import ReactionsAndComments from "./../ReactionsAndComments";
import { OrderOfDataByTime } from "../../../../../../lib/common/names";
import FetchMoreInfiniteComponent from "../../../../../FetchMoreInfiniteQueryComponent";
import dynamic from "next/dynamic";
import { UserIdContext } from "../../../..";
import { useContext } from "react";
import Post from "./Post";

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

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
          endingMsg="You're all caught up!"
        />
      </div>
    </>
  );
};

export default PostsListComponent;
