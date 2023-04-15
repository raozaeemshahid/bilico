import { useContext } from "react";
import { toast } from "react-toastify";
import { UserIdContext } from "../../..";
import { ModalContext } from "../../../../../pages/_app";
import { api } from "../../../../../utils/api";
import DropDown from "../../../../TopRightDropdown/InlineDropDown";

const RequestSent: React.FC = () => {
  const cancelRequestApi = api.publicApi.Relation.cancelRequest.useMutation()
  const utils = api.useContext()
  const modalControl = useContext(ModalContext)
  const userId = useContext(UserIdContext)
  
  return (
    <div className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 p-1 px-3">
      <h3>Request Sent</h3>
      <DropDown
        options={[
          {
            label: "Cancel",
            onClick: () => {
              if (cancelRequestApi.isLoading) return;
              modalControl.changeModal({
                text: "Cancel Request",
                confirmText: "Confirm",
                confirm: () => {
                  void toast.promise(
                    cancelRequestApi 
                      .mutateAsync({ otherUserId: userId })
                      .then(() =>
                        utils.publicApi.getProfile.invalidate({ userId })
                      ),
                    {
                      success: "Cancelled",
                      error: "Couldn't Cancel",
                      pending: "Cancelling Request",
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
export default RequestSent;
