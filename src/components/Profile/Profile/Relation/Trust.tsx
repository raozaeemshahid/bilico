import { useContext } from "react";
import { toast } from "react-toastify";
import { UserIdContext } from "../..";
import { ModalContext } from "../../../../pages/_app";
import { api } from "../../../../utils/api";
import DropDown from "../../../TopRightDropdown/InlineDropDown";

const Trust: React.FC<{
  trusts: boolean;
  userName: string;
}> = ({ trusts, userName }) => {
  const trustApi = api.publicApi.Relation.trust.useMutation();
  const removeTrustApi = api.publicApi.Relation.removeTrust.useMutation();
  const utils = api.useContext();
  const userId = useContext(UserIdContext);
  const modalControl = useContext(ModalContext);
  if (!trusts) {
    return (
      <button
        onClick={() => {
          if (trustApi.isLoading) return;
          modalControl.changeModal({
            text: `Trust ${userName}?`,
            confirmText: "Trust",
            confirm: () => {
              void toast.promise(
                trustApi
                  .mutateAsync({ otherUserId: userId })
                  .then(() =>
                    utils.publicApi.getProfile.invalidate({ userId })
                  ),
                {
                  success: "Trusted",
                  error: "Couldn't Trust",
                  pending: "Trusting",
                }
              );
            },
          });
        }}
        className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 p-1 px-3 shadow-md shadow-gray-900"
      >
        Trust
      </button>
    );
  }
  return (
    <div className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 p-1 px-3 shadow-md shadow-gray-900">
      <h3>Trusted</h3>
      <DropDown
        options={[
          {
            label: "Remove Trust",
            onClick: () => {
              if (removeTrustApi.isLoading) return;
              modalControl.changeModal({
                text: `Untrust ${userName}?`,
                confirmText: "Remove Trust",
                confirm: () => {
                  void toast.promise(
                    removeTrustApi
                      .mutateAsync({ otherUserId: userId })
                      .then(() =>
                        utils.publicApi.getProfile.invalidate({ userId })
                      ),
                    {
                      success: "Trust Removed",
                      error: "Couldn't Remove Trust",
                      pending: "Removing Trust",
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
export default Trust;
