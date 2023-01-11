import { useSession } from "next-auth/react";
import Image from "next/image";

const ImageComponent: React.FC = () => {
  const { data: userSession } = useSession();
  if (!userSession || !userSession.user || !userSession.user.image)
    return <></>;
  return (
    <>
      <div className="mb-3">
        {userSession.user.image && (
          <Image
            alt="Profile Pic"
            src={userSession.user.image}
            width="66"
            height="66"
            className="rounded-full"
          />
        )}
      </div>
    </>
  );
};

export default ImageComponent;
