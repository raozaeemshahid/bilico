import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { ModalContext } from "../../../../pages/_app";
import { api } from "../../../../utils/api";

const ActionButtons: React.FC<{
  userId: string;
}> = ({ userId }) => {
  const [status, changeStatus] = useState<"Accepted" | "Rejected">();

  const acceptRequestApi = api.publicApi.Relation.acceptRequest.useMutation();
  const rejectRequestApi = api.publicApi.Relation.rejectRequest.useMutation();
  const modalControl = useContext(ModalContext);

  if (status === "Accepted")
    return <h2 className="rounded-lg bg-green-600 p-1 px-3">Accepted</h2>;
  if (status === "Rejected")
    return <h2 className="rounded-lg bg-gray-600 p-1 px-3">Rejected</h2>;

  return (
    <>
      <div className="flex items-center gap-2">
        <h2
          className="cursor-pointer rounded-lg bg-gray-600 p-1 px-3 hover:bg-gray-800"
          onClick={() => {
            if (acceptRequestApi.isLoading) return;
            modalControl.changeModal({
              text: "Reject Request",
              confirmText: "Reject",
              confirm: () => {
                void toast.promise(
                  rejectRequestApi
                    .mutateAsync({ otherUserId: userId })
                    .then(() => changeStatus("Rejected")),
                  {
                    success: "Rejected",
                    error: "Couldn't Reject",
                    pending: "Rejecting Request",
                  }
                );
              },
            });
          }}
        >
          Reject
        </h2>
        <h2
          className="cursor-pointer rounded-lg bg-green-600 p-1 px-3 hover:bg-green-700"
          onClick={() => {
            if (acceptRequestApi.isLoading) return;
            modalControl.changeModal({
              text: "Accept Request",
              confirmText: "Accept",
              confirm: () => {
                void toast.promise(
                  acceptRequestApi
                    .mutateAsync({ senderId: userId })
                    .then(() => changeStatus("Accepted")),
                  {
                    success: "Accepted",
                    error: "Couldn't Accept",
                    pending: "Accepting Request",
                  }
                );
              },
            });
          }}
        >
          Accept
        </h2>
      </div>
    </>
  );
};
export default ActionButtons;
