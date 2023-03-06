import { Skill } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import PagesLinks from "../../../lib/PagesLink";

const User: React.FC<{
  id: string;
  image: string | null;
  name: string;
  skills: Skill[];
  bio: string | null;
}> = ({ image, name, bio, skills, id }) => {
  return (
    <div key={id} className="w-full rounded-lg border-b border-gray-400  bg-gray-800 py-3 px-1 sm:px-3 ">
      <div className="flex flex-col gap-3">
        <Link href={PagesLinks.getProfileLink(id)}>
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
              <h2 className="text-md sm:text-base">{name}</h2>
              <h3 className="text-sm text-gray-100 opacity-80">{bio}</h3>
            </div>
          </div>
        </Link>
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
  );
};

export default User;
