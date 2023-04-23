import moment from "moment";
import BadWordsFilter from "../../../utils/BadWordFilter";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";
import Image from "next/image";
import { useContext } from "react";
import { ModalContext } from "../../../pages/_app";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

const NotificationItem: React.FC<{
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
  link,
  title,
  isSeen,
  subText,
  byUserId,
  commentId,
  createdAt,
  byUserName,
  byUserImage,
}) => {
  const controlModal = useContext(ModalContext);
  const replyCommentApi = api.publicApi.replyComment.useMutation();
  const submitReply = (reply: string) => {
    if (!commentId) return;
    void toast.promise(
      replyCommentApi.mutateAsync({
        comment: reply,
        replyToCommentId: commentId,
      }),
      {
        error: "Couldn't Reply",
        pending: "Replying",
        success: "Replied",
      }
    );
  };
  return (
    <>
      <div
        className={`w-full rounded-lg border-l border-b border-gray-700 ${
          isSeen ? "bg-gray-800" : "bg-gray-900"
        } px-2 shadow-md shadow-gray-900 xs:px-4`}
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
                <h2>
                  {byUserId ? (
                    <Link
                      className="font-semibold hover:underline"
                      href={PagesLinks.getProfileLink(byUserId)}
                    >
                      {byUserName}
                    </Link>
                  ) : (
                    <span className="font-semibold">{byUserName}</span>
                  )}
                  {title}
                </h2>
              </div>
            </div>
            {!!subText && subText.length > 0 && (
              <Link href={link}>
                <div
                  className={`flex rounded-lg border-l-2 ${
                    isSeen ? "border-gray-700" : "border-gray-800"
                  }  p-2 hover:${isSeen ? "bg-gray-700" : "bg-gray-800"}`}
                >
                  <h4 className="text-sm text-gray-100  opacity-95">
                    {BadWordsFilter.clean(subText)}
                  </h4>
                </div>
              </Link>
            )}
            {commentId && (
              <div className="my-1 flex items-center p-1">
                <h2
                  className="cursor-pointer text-xs font-semibold text-gray-300 hover:underline"
                  onClick={() => {
                    controlModal.changeModal({
                      confirm: submitReply,
                      text: `Replying to ${byUserName || ""}${
                        byUserName ? "'s" : ""
                      } Comment`,
                      confirmText: "Send",
                      includeNote: true,
                      noteText: "Write your reply",
                    });
                  }}
                >
                  Reply
                </h2>
              </div>
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
