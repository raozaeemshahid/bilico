import Image from "next/image";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { IoMdDoneAll } from "react-icons/io";
import { api } from "../../../utils/api";

const ProfileHead: React.FC<{
  img: string | null;
  name: string;
  _bio: string | null;
}> = ({ name, img, _bio }) => {
  const [bio, changeBio] = useState(_bio || "");
  const [isBioEditing, changeIsBioEditing] = useState(
    !_bio || _bio.length == 0
  );

  const updateBio = api.me.updateBio.useMutation();

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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl text-gray-200">{name}</h1>
        {isBioEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex">
              <input
                className="focus:shadow-outline w-full appearance-none rounded bg-gray-700 py-[1.5] px-3 text-sm leading-tight text-white  shadow focus:outline-none"
                type="text"
                value={bio}
                placeholder="Edit Your Bio"
                onChange={(el) => changeBio(el.target.value)}
              />
              <button
                className="rounded bg-gray-900 p-2"
                onClick={() => {
                  if (bio.length == 0) return;
                  updateBio.mutate({ bio: bio });
                  changeIsBioEditing(false);
                }}
              >
                <IoMdDoneAll className=" hover:scale-110 active:scale-90" />
              </button>
            </div>
          </form>
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
