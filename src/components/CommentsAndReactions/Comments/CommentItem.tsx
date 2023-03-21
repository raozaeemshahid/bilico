import Image from "next/image";
import moment from "moment";
import dynamic from "next/dynamic";
import BadWordsFilter from "../../../utils/BadWordFilter";
import TopRightDropDown from "../../TopRightDropdown";
import DropDown from "./DropDown";

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
    image: string | null | undefined;
    name: string | undefined;
    isVerified: boolean | undefined;
  };
}> = ({ comment, userData, deleteComment }) => {
  return (
    <>
      <div className="w-full rounded-lg py-3 px-0 xs:px-4 sm:m-2">
        <div className="">
          <div className="flex items-center gap-3">
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
            <div className="flex w-full flex-col text-sm">
              <div className="w-full rounded-md bg-gray-800 p-2">
                <div className="flex items-center gap-1 text-base">
                  <h3 className="whitespace-nowrap">{userData.name}</h3>
                  <h3>{userData.isVerified && <MdVerified />}</h3>
                </div>
                <h4 className=" text-gray-200">
                  {BadWordsFilter.clean(comment.body)}
                </h4>
              </div>
              <h3 className="text-sm text-gray-100 opacity-80">
                {moment(comment.createdAt).fromNow()}
              </h3>
            </div>
            <DropDown
              options={[
                { label: "Delete", onClick: () => deleteComment(comment.id) },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default CommentItem;
