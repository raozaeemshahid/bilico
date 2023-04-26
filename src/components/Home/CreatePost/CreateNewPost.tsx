import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import zodPost from "../../../lib/zod/zodPost";

const CreateNewPost: React.FC<{
  postBody: string;
  changePostBody: Dispatch<SetStateAction<string>>;
  changeIsInPreview: Dispatch<SetStateAction<boolean>>;
}> = ({ changePostBody, postBody, changeIsInPreview }) => {
  return (
    <>
      <div className="w-full">
        <div className="mb-6 flex w-full flex-col gap-3 rounded-xl border-b-2 border-gray-900 p-0 xs:p-3">
          <h2 className="text-center text-2xl font-bold text-gray-200">
            Create a Post
          </h2>
          <textarea
            value={postBody}
            onChange={(e) => changePostBody(e.target.value)}
            id="large-input"
            className="sm:text-md block h-40 w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-lg text-gray-200 placeholder-gray-400 shadow-lg shadow-gray-800 focus:border-blue-500 focus:ring-blue-500"
            placeholder="What did you learn today?"
          />
          <div className="flex flex-row-reverse flex-wrap justify-start">
            <button
              className="m-2 flex rounded bg-green-600 py-2 px-4 font-bold text-white shadow-sm shadow-green-600 hover:bg-green-600"
              onClick={() => {
                const parsedPost = zodPost.safeParse(postBody);
                if (!parsedPost.success)
                  return parsedPost.error.errors.forEach((err) =>
                    toast.error(err.message)
                  );
                changeIsInPreview(true);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateNewPost;
