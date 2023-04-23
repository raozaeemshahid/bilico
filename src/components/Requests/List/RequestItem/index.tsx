import Image from "next/image";
import moment from "moment";
import dynamic from "next/dynamic";
import BadWordsFilter from "../../../../utils/BadWordFilter";
import Link from "next/link";
import PagesLinks from "../../../../lib/PagesLink";
import ActionButtons from "./ConfirmButtons";

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const Request: React.FC<{
  request: {
    id: string;
    createdAt: Date;
    message: string;
    isSeen: boolean;
  };
  userData: {
    id: string;
    image: string | null | undefined;
    name: string | undefined;
    Bio: string | null;
    isVerified: boolean | undefined;
  };
}> = ({ request, userData }) => {
  return (
    <>
      <div
        key={request.id}
        className="w-full rounded-lg bg-gray-800 py-3 px-0 xs:px-4 sm:m-2"
      >
        <div className="rounded-lg bg-gray-700 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  {!!userData.image && (
                    <Link href={PagesLinks.getProfileLink(userData.id)}>
                      <Image
                        alt="Profile Pic"
                        className="rounded-full"
                        width={40}
                        height={40}
                        src={userData.image}
                      />
                    </Link>
                  )}
                </div>
                <div className="flex flex-col">
                  <Link href={PagesLinks.getProfileLink(userData.id)}>
                    <div className="flex items-center gap-1 text-sm hover:underline">
                      <h3 className="whitespace-nowrap font-semibold">
                        {userData.name}
                      </h3>
                      <h3>{userData.isVerified && <MdVerified />}</h3>
                    </div>
                  </Link>
                  {!!userData.Bio && (
                    <h3 className="text-sm text-gray-100 opacity-80">
                      {userData.Bio}
                    </h3>
                  )}
                </div>
              </div>
              {request.message.length > 0 && (
                <h4 className="ml-1 mt-2 flex flex-col gap-2 text-sm text-gray-200">
                  {request.message.split("\n").map((paragaraph) => {
                    if (paragaraph.length == 0) return null;
                    return (
                      <span key={`${Math.random()}`}>
                        {BadWordsFilter.clean(paragaraph)}
                      </span>
                    );
                  })}
                </h4>
              )}
            </div>
            <ActionButtons userId={userData.id} />
          </div>
          <h3 className="flex w-full justify-end text-sm text-gray-100 opacity-80">
            {moment(request.createdAt).fromNow()}
          </h3>
        </div>
      </div>
    </>
  );
};
export default Request;
