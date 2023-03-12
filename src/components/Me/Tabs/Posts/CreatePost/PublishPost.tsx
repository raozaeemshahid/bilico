import type { Dispatch, SetStateAction } from "react";
import BadWordsFilter from "../../../../../utils/BadWordFilter";

const PublishPost: React.FC<{
  postBody: string;
  changeIsInPreview: Dispatch<SetStateAction<boolean>>;
  createPost: () => void
}> = ({ postBody, changeIsInPreview, createPost }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="m-2 text-sm text-gray-200 opacity-70">
        <h2>
          {BadWordsFilter.isProfane(postBody)
            ? "We censored some bad words which seems offensive to other users, you can try using synonyms"
            : ""}
        </h2>
        <h2>You can&apos;t edit your post later</h2>
      </div>
      <div className="flex min-w-fit flex-row-reverse flex-wrap justify-start">
        <button
          className="m-2 flex rounded bg-green-600 py-2 px-4 font-bold text-white shadow-sm shadow-green-600 hover:bg-green-700"
          onClick={createPost}
        >
          Publish
        </button>
        <button
          className="m-2 flex rounded bg-blue-500 py-2 px-4 font-bold text-white shadow-sm shadow-blue-500 hover:bg-blue-700"
          onClick={() => {
            changeIsInPreview(false);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};
export default PublishPost;
