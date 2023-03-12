import { api } from "../../../utils/api";
import { useSession } from "next-auth/react";
import Loading from "../../Loading";
import ProfileHead from "./ProfileHead";
import BioData from "./BioData";
import InterestAndSKill from "./InterestAndSkills";
import Numbers from "./Numbers";

const Profile: React.FC = () => {
  const { status } = useSession();
  
  const userData = api.me.data.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;

  return (
    <>
      <div className="flex flex-col">
        <ProfileHead />
        <div className="flex  flex-wrap sm:flex-nowrap">
          <Numbers />
          <BioData />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap">
          <InterestAndSKill />
        </div>
      </div>
    </>
  );
};

export default Profile;
