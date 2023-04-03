import Image from "next/image";
import moment from "moment";
import dynamic from "next/dynamic";
import BadWordsFilter from "../../../utils/BadWordFilter";
import TopRightDropDown from "../../TopRightDropdown";
import DropDown from "./DropDown";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { api } from "../../../utils/api";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";
import { Dispatch, SetStateAction } from "react";
import { SelectedComment } from ".";

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const CommentItem: React.FC<{
  theme?: "Dark" | "Transparent";
  deleteComment: (id: string) => void;
  changeSelectedComment: Dispatch<SetStateAction<SelectedComment | undefined>>;
  ReplyTo?: SelectedComment;
  comment: {
    id: string;
    createdAt: Date;
    body: string;
    _count: { replies: number };
  };
  userData: {
    id: string;
    image: string | null;
    name: string;
    isVerified: boolean;
  };
}> = ({
  comment,
  userData,
  deleteComment,
  ReplyTo,
  changeSelectedComment,
  theme = "Transparent",
}) => {
  const { data: userSession } = useSession();
  if (!userSession || !userSession.user) return <></>;
  return (
    <div className="mx-0 w-fit sm:m-2">
      <div className="flex w-fit items-center gap-2 rounded-lg">
        <div
          className={`flex w-fit items-center gap-2 rounded-lg ${
            theme == "Dark" ? "bg-gray-800" : ""
          } px-3`}
        >
          <div>
            {!!userData.image && (
              <Link href={PagesLinks.getProfileLink(userData.id)}>
                <Image
                  alt="Profile Pic"
                  className="rounded-full"
                  width={30}
                  height={30}
                  src={userData.image}
                />
              </Link>
            )}
          </div>
          <div className="p-2">
            <Link href={PagesLinks.getProfileLink(userData.id)}>
              <div className="flex items-center gap-1 text-sm hover:underline">
                <h3 className="whitespace-nowrap font-semibold">
                  {userData.name}
                </h3>
                <h3>{userData.isVerified && <MdVerified />}</h3>
              </div>
            </Link>
            <h4 className="text-sm text-gray-100 opacity-95">
              {BadWordsFilter.clean(comment.body)}
            </h4>
          </div>
        </div>
        {userSession.user.id == userData.id && (
          <DropDown
            options={[
              { label: "Delete", onClick: () => deleteComment(comment.id) },
            ]}
          />
        )}
      </div>
      <div className="m-1 flex items-center gap-2">
        <h2 className="text-xs opacity-70">
          {moment(comment.createdAt).fromNow()}
        </h2>
        <h2
          className="cursor-pointer text-xs hover:underline"
          onClick={() => {
            changeSelectedComment({
              Comment: comment.body,
              CreatedAt: comment.createdAt,
              CreatedBy: {
                id: userData.id,
                image: userData.image,
                isVerified: userData.isVerified,
                name: userData.name,
              },
              _count: { Replies: comment._count.replies },
              id: comment.id,
              ReplyTo: ReplyTo,
            });
          }}
        >
          {comment._count.replies > 0 ? comment._count.replies : ""} Reply
        </h2>
      </div>
    </div>
  );
};
export default CommentItem;
