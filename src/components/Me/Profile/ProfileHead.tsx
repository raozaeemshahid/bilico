import Image from "next/image";
import { useState } from "react";
import { api } from "../../../utils/api";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import zodBio from "../../../lib/zod/zodBio";

const FiEdit3 = dynamic(() =>
  import("react-icons/fi").then((icons) => icons.FiEdit3)
);
const IoMdDoneAll = dynamic(() =>
  import("react-icons/io").then((icons) => icons.IoMdDoneAll)
);
const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const ProfileHead: React.FC<{
  bio: string | null;
  image: string | null;
  name: string;
  isVerified: boolean;
}> = ({ bio, image, name, isVerified }) => {
  const updateBio = api.me.updateBio.useMutation();

  const [Bio, changeBio] = useState<string>(bio ?? "");
  const [isBioEditing, changeIsBioEditing] = useState(!bio);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg p-2  sm:flex-nowrap">
      {!!image && (
        <Image
          alt="Profile Pic"
          width={72}
          height={72}
          src={image}
          className="rounded-full border-2 border-gray-200 bg-white"
        />
      )}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-2xl">
          <h1 className=" text-gray-200">{name}</h1>
          {isVerified && <MdVerified />}
        </div>

        {isBioEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const parsedBio = zodBio.safeParse(Bio);
              if (parsedBio.success) {
                updateBio.mutate({ bio: Bio });
                changeIsBioEditing(false);
              } else {
                parsedBio.error.errors.forEach((err) =>
                  toast.error(err.message)
                );
              }
            }}
          >
            <div className="flex">
              <input
                className="focus:shadow-outline w-full appearance-none rounded bg-gray-700 px-3 py-[1.5] text-sm leading-tight text-white  shadow focus:outline-none"
                type="text"
                value={Bio}
                placeholder="Edit Your Bio..."
                onChange={(el) => changeBio(el.target.value)}
              />
              <button className="rounded bg-gray-900 p-2" type="submit">
                <IoMdDoneAll className=" hover:scale-110 active:scale-90" />
              </button>
            </div>
          </form>
        ) : updateBio.isLoading ? (
          <div className="flex items-center gap-1 p-1 text-gray-300">
            Saving...
          </div>
        ) : (
          <div className="flex items-center gap-1 p-1 text-gray-300">
            {Bio}
            <button
              onClick={() => {
                changeIsBioEditing(true);
              }}
            >
              <FiEdit3 className="text-sm  hover:scale-110 active:scale-90" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHead;
