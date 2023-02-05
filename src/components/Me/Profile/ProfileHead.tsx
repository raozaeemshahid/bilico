import Image from "next/image";
import { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { IoMdDoneAll } from "react-icons/io";
import { api } from "../../../utils/api";
import { MdVerified } from "react-icons/md";
import { zodBio } from "../../../lib/zod";

const ProfileHead: React.FC<{
  img: string | null;
  name: string;
  _bio: string | null;
  isVerified: boolean;
}> = ({ name, img, _bio, isVerified }) => {
  const [bio, changeBio] = useState(_bio || "");
  const [isBioEditing, changeIsBioEditing] = useState(
    !_bio || _bio.length == 0
  );
  const [errors, changeError] = useState<string[]>([]);

  const updateBio = api.me.updateBio.useMutation();

  useEffect(() => {
    changeError([]);
  }, [isBioEditing, bio]);

  return (
    <div className="flex items-center justify-center gap-4 rounded-lg  p-2">
      {!!img && (
        <Image
          alt="Profile Pic"
          width={72}
          height={72}
          src={img}
          className="rounded-full border-2 border-gray-200 bg-white"
        />
      )}
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2 text-2xl">
          <h1 className=" text-gray-200">{name}</h1>
          {isVerified && <MdVerified />}
        </div>
        {errors.length > 0 &&
          errors.map((err) => (
            <p className="text-sm text-red-400" key={err}>
              {err}
            </p>
          ))}
        {isBioEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const parsedBio = zodBio.safeParse(bio);
              if (parsedBio.success) {
                updateBio.mutate({ bio });
                changeIsBioEditing(false);
              } else {
                changeError(parsedBio.error.errors.map((err) => err.message));
              }
            }}
          >
            <div className="flex">
              <input
                className="focus:shadow-outline w-full appearance-none rounded bg-gray-700 py-[1.5] px-3 text-sm leading-tight text-white  shadow focus:outline-none"
                type="text"
                value={bio}
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
            {bio}
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
