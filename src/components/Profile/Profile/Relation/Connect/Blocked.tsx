import { useContext } from "react";
import { toast } from "react-toastify";
import { UserIdContext } from "../../..";
import { ModalContext } from "../../../../../pages/_app";
import { api } from "../../../../../utils/api";
import DropDown from "../../../../TopRightDropdown/InlineDropDown";

const Blocked: React.FC<{
  userName: string;
}> = ({userName}) => {
  const userId = useContext(UserIdContext);
  const unblockApi = api.publicApi.Relation.unblock.useMutation();
  const modalControl = useContext(ModalContext);
  const utils = api.useContext();
  return (
    <div className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 p-1 px-3 shadow-md shadow-gray-900">
      <h3>Blocked</h3>
      <DropDown
        options={[
          {
            label: "Unblock",
            onClick: () => {
              if (unblockApi.isLoading) return;
              modalControl.changeModal({
                text: `Unblock ${userName}?`,
                confirmText: "Unblock",
                confirm: () => {
                  void toast.promise(
                    unblockApi
                      .mutateAsync({ otherUserId: userId })
                      .then(() =>
                        utils.publicApi.getProfile.invalidate({ userId })
                      ),
                    {
                      success: "Unblocked",
                      error: "Couldn't Unblock",
                      pending: "Unblocking",
                    }
                  );
                },
              });
            },
          },
        ]}
      />
    </div>
  );
};
export default Blocked;
