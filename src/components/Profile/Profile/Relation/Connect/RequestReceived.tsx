import { useContext } from "react";
import { toast } from "react-toastify";
import { UserIdContext } from "../../..";
import { ModalContext } from "../../../../../pages/_app";
import { api } from "../../../../../utils/api";
import DropDown from "../../../../TopRightDropdown/InlineDropDown";

const RequestReceived: React.FC = () => {
  const acceptRequestApi = api.publicApi.Relation.acceptRequest.useMutation();
  const rejectRequestApi = api.publicApi.Relation.rejectRequest.useMutation();
  const utils = api.useContext();
  const modalControl = useContext(ModalContext);
  const userId = useContext(UserIdContext);
  return (
    <div className="flex items-center justify-center gap-1 rounded-lg bg-blue-600  p-1 px-3 shadow-md shadow-gray-900">
      <h3>Request Received</h3>
      <DropDown
        options={[
          {
            label: "Accept",
            onClick: () => {
              if (acceptRequestApi.isLoading) return;
              modalControl.changeModal({
                text: "Accept Request",
                confirmText: "Accept",
                confirm: () => {
                  void toast.promise(
                    acceptRequestApi
                      .mutateAsync({ senderId: userId })
                      .then(() =>
                        utils.publicApi.getProfile.invalidate({ userId })
                      ),
                    {
                      success: "Accepted",
                      error: "Couldn't Accept",
                      pending: "Accepting Request",
                    }
                  );
                },
              });
            },
          },
          {
            label: "Reject",
            onClick: () => {
              if (acceptRequestApi.isLoading) return;
              modalControl.changeModal({
                text: "Reject Request?",
                confirmText: "Reject",
                confirm: () => {
                  void toast.promise(
                    rejectRequestApi
                      .mutateAsync({ otherUserId: userId })
                      .then(() =>
                        utils.publicApi.getProfile.invalidate({ userId })
                      ),
                    {
                      success: "Rejected",
                      error: "Couldn't Reject",
                      pending: "Rejecting Request",
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
export default RequestReceived;
