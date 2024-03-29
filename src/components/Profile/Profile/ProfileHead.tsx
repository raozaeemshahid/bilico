import Image from "next/image";
import dynamic from "next/dynamic";

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const ProfileHead: React.FC<{
  image: string | null;
  isVerified: boolean;
  name: string;
  bio: string | null;
}> = ({ bio, image, isVerified, name }) => {
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
          <h1 className="whitespace-nowrap text-gray-200">{name}</h1>
          {isVerified && <MdVerified />}
        </div>
        <div className="flex items-center gap-1 p-1 text-gray-300">{bio}</div>
      </div>
    </div>
  );
};

export default ProfileHead;
