import { useContext } from "react";
import { toast } from "react-toastify";
import TopRightDropDown from '.'
import type { DropDownOption } from ".";
import { copyUrlToClipboard } from "../../lib/copyUrl";
import PagesLinks from "../../lib/PagesLink";
import { ModalContext } from "../../pages/_app";
import { api } from "../../utils/api";
import { UserIdContext } from "../Profile";

const ProfileDropDown: React.FC<{
  isBlockedByVisitor: boolean;
  userName: string;
}> = ({ isBlockedByVisitor, userName }) => {
  const userId = useContext(UserIdContext);
  const modalControl = useContext(ModalContext);
  const blockApi = api.publicApi.Relation.block.useMutation();
  const utils = api.useContext();
  const options: DropDownOption[] = [
    {
      label: "Copy Link",
      onClick: () => {
        copyUrlToClipboard(PagesLinks.getProfileLink(userId));
      },
    },
  ];
  if (!isBlockedByVisitor)
    options.push({
      label: "Block",
      onClick: () => {
        if (blockApi.isLoading) return;
        modalControl.changeModal({
          text: `Block ${userName}?`,
          confirmText: "Block",
          confirm: () => {
            void toast.promise(
              blockApi
                .mutateAsync({ otherUserId: userId })
                .then(() => utils.publicApi.getProfile.invalidate({ userId })),
              {
                success: "Blocked",
                error: "Couldn't Block",
                pending: "Blocking",
              }
            );
          },
        });
      },
    });
  return (
    <>
      <TopRightDropDown options={options} />
    </>
  );
};
export default ProfileDropDown;
