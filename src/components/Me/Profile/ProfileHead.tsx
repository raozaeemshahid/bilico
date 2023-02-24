import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { zodBio } from "../../../lib/zod";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "../../Loading";
import dynamic from "next/dynamic";

const FiEdit3 = dynamic(() =>
  import("react-icons/fi").then((icons) => icons.FiEdit3)
);
const IoMdDoneAll = dynamic(() =>
  import("react-icons/io").then((icons) => icons.IoMdDoneAll)
);
const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const ProfileHead: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();
  // const userInfo = api.me.info.useQuery(undefined, {
  //   enabled: status === "authenticated" && router.isReady,
  // });
  const userData = api.me.data.useQuery(undefined, {
    enabled: status == "authenticated",
    onSuccess(data) {
      if (data.Bio) changeBio(data.Bio);
      else changeIsBioEditing(true);
    },
  });
  const updateBio = api.me.updateBio.useMutation();

  const [Bio, changeBio] = useState<string>("");
  const [isBioEditing, changeIsBioEditing] = useState(false);

  const [errors, changeError] = useState<string[]>([]);

  useEffect(() => {
    changeError([]);
  }, [Bio, isBioEditing]);

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;
  const data = userData.data;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg p-2  sm:flex-nowrap">
      {!!data.image && (
        <Image
          alt="Profile Pic"
          width={72}
          height={72}
          src={data.image}
          className="rounded-full border-2 border-gray-200 bg-white"
        />
      )}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-2xl">
          <h1 className=" text-gray-200">{data.name}</h1>
          {data.isVerified && <MdVerified />}
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
              const parsedBio = zodBio.safeParse(Bio);
              if (parsedBio.success) {
                updateBio.mutate({ bio: Bio });
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
