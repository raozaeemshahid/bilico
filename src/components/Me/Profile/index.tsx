import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { useSession } from "next-auth/react";
import Loading from "../../Loading";
import Image from "next/image";
import ProfileHead from "./ProfileHead";

const Profile: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();
  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
  });
  const userData = api.me.data.useQuery(undefined, {
    enabled: userInfo.data?.success,
  });
  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;
  console.log(userData.data);

  return (
    <>
      <div className="flex flex-col">
        <ProfileHead
          name={userData.data.name}
          _bio={userData.data.Bio}
          img={userData.data.image}
        />
      </div>
    </>
  );
};

export default Profile;
