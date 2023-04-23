import Head from "next/head";
import { api } from "../../utils/api";
import Loading from "../Loading";
import PostItem from "./PostItem";

const CommentComponnet: React.FC<{ commentId: string }> = ({ commentId }) => {
  const getHighlightedComment = api.publicApi.getHighlightedComment.useQuery({
    commentId,
  });
  if (!getHighlightedComment.data)
    return <Loading text="Getting Things Ready" />;

  const comment = getHighlightedComment.data;
  const post = comment.post;
  const userName = comment.selectedComment.highlightedComment
    ? comment.selectedComment.highlightedComment.CreatedBy.name.split(" ")[0]
    : comment.selectedComment.CreatedBy.name.split(" ")[0];
  const title = (userName ? `${userName}'s ` : "") + "Comment";

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="my-3 flex justify-center">
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      <div className="m-2 w-full rounded-lg px-0 py-3 xs:px-4 md:px-7">
        <div className="m-2 rounded-lg py-3 md:px-3">
          <PostItem
            highlightedCommentId={commentId}
            post={{
              _count: {
                comments: post._count.Comments,
                reactions: post._count.Reactions,
              },
              body: post.Body,
              createdAt: post.CreatedAt,
              id: post.id,
              interests: post.Interests,
              reactionByVisitor: post.reactionByVisitor,
            }}
            userData={post.CreatedBy}
          />
        </div>
      </div>
    </>
  );
};

export default CommentComponnet;
