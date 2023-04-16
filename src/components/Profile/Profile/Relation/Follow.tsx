import { useContext } from "react";
import { toast } from "react-toastify";
import { UserIdContext } from "../..";
import { ModalContext } from "../../../../pages/_app";
import { api } from "../../../../utils/api";
import DropDown from "../../../TopRightDropdown/InlineDropDown";

const Follow: React.FC<{
  following: boolean;
}> = ({ following }) => {
  const followApi = api.publicApi.Relation.follow.useMutation();
  const unfollowApi = api.publicApi.Relation.unfollow.useMutation();
  const utils = api.useContext();
  const userId = useContext(UserIdContext);
  const modalControl = useContext(ModalContext);
  if (!following) {
    return (
      <button
        onClick={() => {
          if (followApi.isLoading) return;
          modalControl.changeModal({
            text: "",
            confirmText: "Follow",
            confirm: () => {
              void toast.promise(
                followApi
                  .mutateAsync({ otherUserId: userId })
                  .then(() =>
                    utils.publicApi.getProfile.invalidate({ userId })
                  ),
                {
                  success: "Followed",
                  error: "Couldn't Follow",
                  pending: "Following",
                }
              );
            },
          });
        }}
        className="flex items-center shadow-md shadow-gray-900 justify-center gap-1 rounded-lg bg-blue-600 p-1 px-3"
      >
        Follow
      </button>
    );
  }
  return (
    <div className="flex items-center justify-center gap-1 shadow-md shadow-gray-900 rounded-lg bg-blue-600 p-1 px-3">
      <h3>Following</h3>
      <DropDown
        options={[
          {
            label: "Unfollow",
            onClick: () => {
              if (unfollowApi.isLoading) return;
              modalControl.changeModal({
                text: "",
                confirmText: "unfollow",
                confirm: () => {
                  void toast.promise(
                    unfollowApi
                      .mutateAsync({ otherUserId: userId })
                      .then(() =>
                        utils.publicApi.getProfile.invalidate({ userId })
                      ),
                    {
                      success: "Unfollowed",
                      error: "Couldn't Unfollow",
                      pending: "Unfollowing",
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
export default Follow;
