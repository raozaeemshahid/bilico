import { useContext } from "react";
import TopRightDropDown from ".";
import { copyUrlToClipboard } from "../../lib/copyUrl";
import PagesLinks from "../../lib/PagesLink";
import { UserIdContext } from "../Profile";

const ProfileDropDown: React.FC = () => {
  const userId = useContext(UserIdContext);
  return (
    <>
      <TopRightDropDown
        options={[
          {
            label: "Copy Link",
            onClick: () => {
              copyUrlToClipboard(PagesLinks.getProfileLink(userId));
            },
          },
        ]}
      />
    </>
  );
};
export default ProfileDropDown;
