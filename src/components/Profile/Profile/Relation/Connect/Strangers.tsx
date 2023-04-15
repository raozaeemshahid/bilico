import { useContext } from "react";
import { toast } from "react-toastify";
import { UserIdContext } from "../../..";
import { ModalContext } from "../../../../../pages/_app";
import { api } from "../../../../../utils/api";

const Strangers: React.FC = () => {
  const controlModal = useContext(ModalContext);
  const sendRequestApi = api.publicApi.Relation.sendRequest.useMutation();
  const utils = api.useContext();
  const userId = useContext(UserIdContext);

  return (
    <button
      onClick={() => {
        if (sendRequestApi.isLoading) return;
        controlModal.changeModal({
          text: "Send Request",
          confirmText: "Send",
          includeNote: true,
          noteText: "Write them a note",
          confirm: (note) => {
            void toast.promise(
              sendRequestApi
                .mutateAsync({ message: note, receiverId: userId })
                .then(() => utils.publicApi.getProfile.invalidate({ userId })),
              {
                success: "Sent Request",
                pending: "Sending",
                error: "Couln't Send",
              }
            );
          },
        });
      }}
      className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 p-1 px-3"
    >
      Connect
    </button>
  );
};
export default Strangers;
