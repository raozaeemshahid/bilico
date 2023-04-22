import ProfileHead from "./ProfileHead";
import BioData from "./BioData";
import InterestAndSKill from "./InterestAndSkills";
import Numbers from "./Numbers";
import MyProfileDropDown from "../../TopRightDropdown/MyProfileDropDown";
import { useState } from "react";

import ShowList from "./ShowList";
import { useSession } from "next-auth/react";
import { api } from "../../../utils/api";
import Loading from "../../Loading";

export type ProfileNumbersListTexts =
  | "Connections"
  | "Followers"
  | "Following"
  | "Trusted"
  | "Trusts"
  | "Posts";

const Profile: React.FC = () => {
  const [showList, changeShowList] = useState<{
    list: ProfileNumbersListTexts;
    count: number;
  }>();
  const { status } = useSession();
  const userData = api.me.data.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;

  return (
    <>
      <div className="flex flex-col">
        <MyProfileDropDown />
        <ProfileHead />
        <div className="flex flex-col gap-3 xs:mx-2">
          <div className="flex flex-wrap  gap-3 sm:flex-nowrap">
            <Numbers changeShowList={changeShowList} />
            <BioData />
          </div>
          {!!showList && showList.list !== "Posts" && (
            <div className="flex flex-wrap sm:flex-nowrap">
              <ShowList
                list={showList.list}
                count={showList.count}
                changeShowList={changeShowList}
              />
            </div>
          )}
          <div className="flex flex-wrap sm:flex-nowrap">
            <InterestAndSKill />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
