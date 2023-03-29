import Image from "next/image";
import moment from "moment";
import dynamic from "next/dynamic";
import BadWordsFilter from "../../../utils/BadWordFilter";
import TopRightDropDown from "../../TopRightDropdown";
import DropDown from "./DropDown";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const CommentItem: React.FC<{
  deleteComment: (id: string) => void;
  comment: {
    id: string;
    createdAt: Date;
    body: string;
    _count: { replies: number };
  };
  userData: {
    id: string;
    image: string | null | undefined;
    name: string | undefined;
    isVerified: boolean | undefined;
  };
}> = ({ comment, userData, deleteComment }) => {
  const { data: userSession } = useSession();
  if (!userSession || !userSession.user) return <></>;
  return (
    <div className="w-fit py-3 px-0 sm:m-2">
      <div className="flex w-fit items-center gap-2 rounded-lg bg-gray-700 px-2">
        <div>
          {!!userData.image && (
            <Image
              alt="Profile Pic"
              className="rounded-full"
              width={34}
              height={34}
              src={userData.image}
            />
          )}
        </div>
        <div className="p-2">
          <div className="flex items-center gap-1 text-base">
            <h3 className="whitespace-nowrap">{userData.name}</h3>
            <h3>{userData.isVerified && <MdVerified />}</h3>
          </div>
          <h4 className="text-gray-200">
            {BadWordsFilter.clean(comment.body)}
          </h4>
        </div>
        {userSession.user.id == userData.id && (
          <DropDown options={[{ label: "Delete", onClick: () => {} }]} />
        )}
      </div>
    </div>
  );
};
export default CommentItem;
