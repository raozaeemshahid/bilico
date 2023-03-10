import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";
import { FiEdit3 } from "react-icons/fi";
import {Interest} from "@prisma/client";

const InterestAndSKill: React.FC<{interests: {title: string}[], skills: {title: string}[]}> = ({interests, skills}) => {
  return (
    <>
      <div className="m-2 w-full rounded-lg bg-gray-800 border-2 border-b-0 border-gray-400 p-3">
        <div className="flex justify-end">
          <Link href={PagesLinks.EDIT_ACCOUNT_LINK} className="">
            <FiEdit3 className="text-sm hover:scale-110 active:scale-90" />
          </Link>
        </div>
        {interests.length > 0 && (
          <div className="flex flex-col">
            <h2 className="text-lg">Interests</h2>
            <div className="ml-3 mt-1 flex flex-wrap gap-1">
              {interests.map((interest) => (
                <h4
                  className="rounded-md shadow-sm shadow-gray-800 bg-green-600 p-1 px-3 text-sm font-semibold"
                  key={interest.title}
                >
                  {interest.title}
                </h4>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="mt-4 flex flex-col">
            <h2 className="text-lg">Skills</h2>
            <div className="ml-3 mt-1 flex flex-wrap gap-1">
              {skills.map((skill) => (
                <h4
                  className="rounded-md bg-cyan-600 shadow-sm shadow-gray-800 p-1  px-3 text-sm font-semibold"
                  key={skill.title}
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
