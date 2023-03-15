import { api } from "../../../utils/api";
import { useSession } from "next-auth/react";
import Loading from "../../Loading";
import ProfileHead from "./ProfileHead";
import BioData from "./BioData";
import InterestAndSKill from "./InterestAndSkills";
import Numbers from "./Numbers";
import TopRightDropDown from "../../TopRightDropdown";
import { useRouter } from "next/router";
import PagesLinks from "../../../lib/PagesLink";

const Profile: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();

  const userData = api.me.data.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;

  return (
    <>
      <div className="flex flex-col">
        <TopRightDropDown
          options={[
            {
              label: "Edit Account",
              onClick: () => {
                void router.push(PagesLinks.EDIT_ACCOUNT_LINK);
              },
            },
            {
              label: "Deactive Account",
              onClick: () => {
                void router.push(PagesLinks.DEATIVATED_ME_LINK);
              },
            },
            {
              label: "Delete Account",
              onClick: () => {
                void router.push(PagesLinks.DELETE_ME_LINK);
              },
            },
          ]}
        />
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
