import type { Dispatch, SetStateAction } from "react";
import type { SelectedComment } from ".";

const SelectedCommentComponent: React.FC<{
  commentId: string;
  changeSelectedComment: Dispatch<SetStateAction<SelectedComment | undefined>>;
}> = ({ commentId, changeSelectedComment }) => {
  return (
    <>
      <div className="h-full rounded-lg py-2 md:px-3">
        <div className="flex items-center justify-center gap-2 rounded-lg border-b-4 border-gray-700 text-center text-sm">
          SelectedComment
        </div>
      </div>
    </>
  );
};
export default SelectedCommentComponent;
