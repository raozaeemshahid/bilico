import Image from "next/image";
import moment from "moment";
import dynamic from "next/dynamic";
import BadWordsFilter from "../../../../../utils/BadWordFilter";

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const WorkItem: React.FC<{
  work: {
    id: string;
    createdAt: Date;
    body: string;
  };
  userData: {
    image: string | null | undefined;
    name: string | undefined;
    isVerified: boolean | undefined;
  };
}> = ({ work, userData }) => {
  return (
    <>
      <div className="w-full rounded-lg bg-gray-800 py-3 px-0 xs:px-4">
        <div className="">
          <div className="flex flex-wrap items-center gap-3">
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
                <h3 className="whitespace-nowrap">{userData.name}</h3>
                <h3>{userData.isVerified && <MdVerified />}</h3>
              </div>
              <h3 className="text-sm text-gray-100 opacity-80 hover:underline">
                {moment(work.createdAt).fromNow()}
              </h3>
            </div>
          </div>
          <h4 className="m-2 my-4 flex flex-col gap-2 text-base">
            {work.body.split("\n").map((paragaraph) => {
              if (paragaraph.length == 0) return null;
              return (
                <span key={`${Math.random()}`}>
                  {BadWordsFilter.clean(paragaraph)}
                </span>
              );
            })}
          </h4>
        </div>
      </div>
    </>
  );
};
export default WorkItem;
