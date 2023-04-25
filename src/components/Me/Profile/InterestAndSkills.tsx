import { useSession } from "next-auth/react";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";
import { FiEdit3 } from "react-icons/fi";

const InterestAndSKill: React.FC = () => {
  const { status } = useSession();
  const userData = api.me.data.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;

  const data = userData.data;
  if (data.Interests.length == 0 && data.Skills.length == 0)
    return (
      <>
        <div className="w-full rounded-lg border-2 border-b-0 border-gray-400 bg-gray-800 p-3">
          <div className="flex justify-center">
            <Link
              href={PagesLinks.EDIT_ACCOUNT_LINK}
              className="rounded-lg bg-blue-600 p-1 px-2 hover:bg-blue-500"
            >
              Add Interests and Skills
            </Link>
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className="w-full rounded-lg border-2 border-b-0 border-gray-400 bg-gray-800 p-3">
        <div className="flex justify-end">
          <Link href={PagesLinks.EDIT_ACCOUNT_LINK} className="">
            <FiEdit3 className="text-sm hover:scale-110 active:scale-90" />
          </Link>
        </div>
        {userData.data.Interests.length > 0 && (
          <div className="flex flex-col">
            <h2 className="text-lg">Interests</h2>
            <div className="ml-3 mt-1 flex flex-wrap gap-1">
              {userData.data.Interests.map((interest) => (
                <h4
                  className="rounded-md bg-green-600 p-1 px-3 text-sm font-semibold shadow-sm shadow-gray-800"
                  key={interest.id}
                >
                  {interest.title}
                </h4>
              ))}
            </div>
          </div>
        )}

        {userData.data.Skills.length > 0 && (
          <div className="mt-4 flex flex-col">
            <h2 className="text-lg">Skills</h2>
            <div className="ml-3 mt-1 flex flex-wrap gap-1">
              {userData.data.Skills.map((skill) => (
                <h4
                  className="rounded-md bg-cyan-600 p-1 px-3 text-sm font-semibold shadow-sm shadow-gray-800"
                  key={skill.id}
                >
                  {skill.title}
                </h4>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InterestAndSKill;
