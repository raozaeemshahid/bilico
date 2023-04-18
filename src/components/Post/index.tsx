import { api } from "../../utils/api";
import Loading from "../Loading";
import PostItem from "./PostItem";

const PostComponent: React.FC<{ postId: string }> = ({ postId }) => {
  const getPost = api.publicApi.getPost.useQuery({
    postId,
  });
  if (!getPost.data || !getPost.data.success)
    return <Loading text="Getting Things Ready" />;

  const post = getPost.data;
  return (
    <>
      <div className="my-3 flex justify-center">
        <h2 className="text-3xl font-bold">{`${post.createdBy.name.split(" ")[0] || ""
          }${post.createdBy.name.split(" ")[0] && "'s"} Post`}</h2>
      </div>
      <div className="m-2 rounded-lg py-3 md:px-3">
        <PostItem
          post={{
            _count: {
              comments: post._count.Comments,
              reactions: post._count.Reactions,
            },
            body: post.body,
            createdAt: post.createdAt,
            id: post.id,
            interests: post.Interests,
            reactionByVisitor: post.VisitorReaction,
          }}
          userData={post.createdBy}
        />
      </div>
    </>
  );
};

export default PostComponent;
