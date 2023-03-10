import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { useSession } from "next-auth/react";
import Loading from "../../Loading";
import ProfileHead from "./ProfileHead";
import BioData from "./BioData";
import InterestAndSKill from "./InterestAndSkills";
import Numbers from "./Numbers";

const Profile: React.FC<{ userId: string }> = ({ userId }) => {
  const router = useRouter();
  const { status } = useSession();

  const userData = api.publicApi.getProfile.useQuery(
    { userId },
    {
      enabled: status == "authenticated",
    }
  );

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;

  const data = userData.data;
  return (
    <>
      <div className="flex flex-col">
        <ProfileHead
          bio={data.bio}
          image={data.image}
          isVerified={data.isVerified}
          name={data.name}
        />
        <div className="flex  flex-wrap sm:flex-nowrap">
          <Numbers _count={data._count} />
          <BioData age={data.age} country={data.country} createdAt={data.createdAt} gender={data.gender} />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap">
          <InterestAndSKill interests={data.interests} skills={data.skills} />
        </div>
      </div>
    </>
  );
};

export default Profile;