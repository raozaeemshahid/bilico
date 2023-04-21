import moment from "moment";
import BadWordsFilter from "../../../utils/BadWordFilter";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";
import Image from "next/image";

const NotificationItem: React.FC<{
  postId: string | null;
  id: string;
  createdAt: Date;
  link: string;
  title: string;
  isSeen: boolean;
  byUserImage: string | null;
  byUserName: string | null;
  byUserId: string | null;
  subText: string | null;
  commentId: string | null;
}> = ({
  id,
  link,
  title,
  isSeen,
  postId,
  subText,
  byUserId,
  commentId,
  createdAt,
  byUserName,
  byUserImage,
}) => {
  return (
    <>
      <div
        className={`w-full rounded-lg border-l border-b border-gray-700 ${
          isSeen ? "bg-gray-800" : "bg-gray-700"
        }  px-0 shadow-md shadow-gray-900 xs:px-4`}
      >
        <div className="flex flex-nowrap items-center gap-3">
          {!!byUserImage && (
            <div>
              <Image
                alt="Profile Pic"
                className="rounded-full"
                width={40}
                height={40}
                src={byUserImage}
              />
            </div>
          )}
          <div className="w-full">
            <div className="py-2 text-gray-300">
              <div className="flex gap-1">
                {byUserId ? (
                  <Link
                    className="hover:underline"
                    href={PagesLinks.getProfileLink(byUserId)}
                  >
                    {byUserName}
                  </Link>
                ) : (
                  <h2>{byUserName}</h2>
                )}
                <Link href={link} className="hover:underline">
                  {title}
                </Link>
              </div>
            </div>
            {!!subText && subText.length > 0 && (
              <Link href={link}>
                <div className="flex rounded-lg border-l-2 border-gray-700  p-2 hover:bg-gray-700">
                  <h4 className="text-sm text-gray-100  opacity-95">
                    {BadWordsFilter.clean(subText)}
                  </h4>
                </div>
              </Link>
            )}
            <div className="my-1 flex items-center justify-end">
              <h2 className="text-xs opacity-70">
                {moment(createdAt).fromNow()}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NotificationItem;
