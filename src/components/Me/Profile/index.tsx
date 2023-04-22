import ProfileHead from "./ProfileHead";
import BioData from "./BioData";
import InterestAndSKill from "./InterestAndSkills";
import Numbers from "./Numbers";
import MyProfileDropDown from "../../TopRightDropdown/MyProfileDropDown";

const Profile: React.FC = () => {
  return (
    <>
      <div className="flex flex-col">
        <MyProfileDropDown />
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
