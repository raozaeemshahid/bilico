import Image from "next/image";
import moment from "moment";
import dynamic from "next/dynamic";
import BadWordsFilter from "../../../../../../utils/BadWordFilter";
import ReactionsAndComments from "../ReactionsAndComments";

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const Post: React.FC<{
  post: {
    id: string;
    createdAt: Date;
    body: string;
    interests: { id: string; title: string }[];
    _count: { comments: number; reactions: number };
  };
  userData: { image: string | null | undefined; name: string | undefined; isVerified: boolean | undefined };
}> = ({ post, userData }) => {
  return (
    <>
      <div
        key={post.id}
        className="w-full rounded-lg border-b border-gray-400 bg-gray-800 py-3 px-0 xs:px-4 sm:m-2"
      >
        <div className="">
          <div className="flex items-center gap-3">
            <div>
              {!!userData.image && (
                <Image
                  alt="Profile Pic"
                  className="rounded-full"
                  width={40}
                  height={40}
                  src={userData.image}
                />
              )}
            </div>
            <div className="flex flex-col">
              <div className="text-md flex items-center gap-1 sm:text-base">
                <h3>{userData.name}</h3>
                <h3>{userData.isVerified && <MdVerified />}</h3>
              </div>
              <h3 className="text-sm text-gray-100 opacity-80">
                {moment(post.createdAt).fromNow()}
              </h3>
            </div>
          </div>
          <h4 className="m-2 my-4 text-base">
            {BadWordsFilter.clean(post.body)}
          </h4>
          <div className="flex gap-1">
            {post.interests.map((interest) => (
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
              commentsCount={post._count.comments}
              postId={post.id}
              reactionsCount={post._count.reactions}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
