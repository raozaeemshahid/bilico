import type { Skill } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";
import dynamic from "next/dynamic";
const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const User: React.FC<{
  id: string;
  image: string | null;
  name: string;
  skills: Skill[];
  bio: string | null;
  isVerified: boolean;
}> = ({ image, isVerified, name, bio, skills, id }) => {
  return (
    <Link href={PagesLinks.getProfileLink(id)}>
      <div
        key={id}
        className="w-full rounded-lg border-b border-gray-400 bg-gray-800  py-3 px-1 hover:bg-gray-700 sm:px-3 "
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div>
              {!!image && (
                <Image
                  alt="Profile Pic"
                  className="rounded-full"
                  width={40}
                  height={40}
                  src={image}
                />
              )}
            </div>
            <div className="flex flex-col">
              <div className="text-md flex items-center gap-1 sm:text-base">
                <h2>{name}</h2>
                {isVerified && <MdVerified />}
              </div>
              <h3 className="text-sm text-gray-100 opacity-80">{bio}</h3>
            </div>
          </div>
          <div className="flex gap-1">
            {skills.map((skill) => (
              <h3
                className="whitespace-nowrap rounded-lg bg-green-700 p-1 px-3 text-xs"
                key={skill.id}
              >
                {skill.title}
              </h3>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default User;
