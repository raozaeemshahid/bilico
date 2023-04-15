import { useContext } from "react";
import { toast } from "react-toastify";
import { UserIdContext } from "../../..";
import { ModalContext } from "../../../../../pages/_app";
import { api } from "../../../../../utils/api";
import DropDown from "../../../../TopRightDropdown/InlineDropDown";

const Connected: React.FC = () => {
  const removeConnnectionApi = api.publicApi.Relation.removeConnection.useMutation();
  const utils = api.useContext();
  const modalControl = useContext(ModalContext);
  const userId = useContext(UserIdContext);
  return (
    <div className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 p-1 px-3">
      <h3>Connected</h3>
      <DropDown
        options={[
          {
            label: "Remove Connection",
            onClick: () => {
              if (removeConnnectionApi.isLoading) return;
              modalControl.changeModal({
                text: "Remove Connection?",
                confirmText: "Remove",
                confirm: () => {
                  void toast.promise(
                    removeConnnectionApi
                      .mutateAsync({ otherUserId: userId })
                      .then(() =>
                        utils.publicApi.getProfile.invalidate({ userId })
                      ),
                    {
                      success: "Removed",
                      error: "Couldn't Remove",
                      pending: "Removing Connection",
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
export default Connected;
