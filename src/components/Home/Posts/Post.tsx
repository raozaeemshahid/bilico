import Image from "next/image";
import moment from "moment";
import dynamic from "next/dynamic";
import type { Reaction } from "@prisma/client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PostDropDown from "../../TopRightDropdown/PostDropDown";
import PagesLinks from "../../../lib/PagesLink";
import BadWordsFilter from "../../../utils/BadWordFilter";
import ReactPostComponent from "../../ReactPost";
import ReactionsAndComments from "../../CommentsAndReactions";

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
    reactionByVisitor: { id: string; Reaction: Reaction } | undefined;
  };
  userData: {
    id: string;
    image: string | null | undefined;
    name: string | undefined;
    isVerified: boolean | undefined;
  };
  deletePost: (postId: string) => void;
}> = ({ post, userData, deletePost }) => {
  const [reactionsCount, changeReactionCount] = useState(post._count.reactions);
  const [commentCount, changeCommentCount] = useState(post._count.comments);
  const { data: userSession } = useSession();

  if (!userSession || !userSession.user) return <></>;
  return (
    <>
      <div
        key={post.id}
        className="w-full rounded-lg bg-gray-800 py-3 px-0 xs:px-4"
      >
        <PostDropDown
          postId={post.id}
          deletePost={deletePost}
          userDataId={userData.id}
          userSessionId={userSession.user.id}
        />
        <div className="">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <Link href={PagesLinks.getProfileLink(userData.id)}>
                {!!userData.image && (
                  <Image
                    alt="Profile Pic"
                    className="rounded-full"
                    width={40}
                    height={40}
                    src={userData.image}
                  />
                )}
              </Link>
            </div>
            <div className="flex flex-col">
              <Link href={PagesLinks.getProfileLink(userData.id)}>
                <div className="text-md flex items-center gap-1 hover:underline sm:text-base">
                  <h3 className="whitespace-nowrap">{userData.name}</h3>
                  <h3>{userData.isVerified && <MdVerified />}</h3>
                </div>
              </Link>
              <Link href={PagesLinks.getPostLink(post.id)}>
                <h3 className="text-sm text-gray-100 opacity-80 hover:underline">
                  {moment(post.createdAt).fromNow()}
                </h3>
              </Link>
            </div>
          </div>
          <h4 className="m-2 my-4 flex flex-col gap-2 text-base">
            {post.body.split("\n").map((paragaraph) => {
              if (paragaraph.length == 0) return null;
              return (
                <span key={`${Math.random()}`}>
                  {BadWordsFilter.clean(paragaraph)}
                </span>
              );
            })}
          </h4>
          <div className="flex flex-wrap gap-1">
            {post.interests.map((interest) => (
              <h3
                className="whitespace-nowrap rounded-lg bg-green-700 p-1 px-3 text-xs"
                key={interest.id}
              >
                {interest.title}
              </h3>
            ))}
          </div>
          {userSession.user.id !== userData.id && (
            <ReactPostComponent
              changeReactionCount={changeReactionCount}
              postId={post.id}
              reactionByVisitor={post.reactionByVisitor}
            />
          )}
          <div className="mt-3">
            <ReactionsAndComments
              changeCommentCount={changeCommentCount}
              commentsCount={commentCount}
              postId={post.id}
              reactionsCount={reactionsCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
