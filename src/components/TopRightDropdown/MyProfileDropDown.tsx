import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import TopRightDropDown from ".";
import { copyUrlToClipboard } from "../../lib/copyUrl";
import PagesLinks from "../../lib/PagesLink";

const MyProfileDropDown: React.FC = () => {
  const { data: userSession } = useSession();
  const router = useRouter();
  if (!userSession || !userSession.user) return null;
  return (
    <>
      <TopRightDropDown
        options={[
          {
            label: "Copy Link",
            onClick: () => {
              copyUrlToClipboard(
                PagesLinks.getProfileLink(
                  !!userSession.user ? userSession.user.id : ""
                )
              );
            },
          },
          {
            label: "Edit Account",
            onClick: () => {
              void router.push(PagesLinks.EDIT_ACCOUNT_LINK);
            },
          },
          {
            label: "Activity Log",
            onClick: () => {
              void router.push(PagesLinks.ACTIVITY_LOG);
            },
          },
          {
            label: "Deactive Account",
            onClick: () => {
              void router.push(PagesLinks.DEACTIVATED_ME_LINK);
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
    </>
  );
};
export default MyProfileDropDown;
