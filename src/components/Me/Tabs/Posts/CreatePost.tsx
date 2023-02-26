import {useState} from "react";
import BadWord from "bad-words";

const BadWordFilter = new BadWord()

const CreatePost: React.FC = () => {
  const [postBody, changePostBody] = useState("")
  return (
    <>
      <div className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mb-6 flex w-full flex-col gap-3 rounded-xl bg-gray-700 p-4 shadow-md shadow-gray-800">
            <h2 className="text-center text-2xl font-bold text-gray-200">
              Create a Post
            </h2>
            <textarea
              value={postBody}
              onChange={e => changePostBody(e.target.value)}
              id="large-input"
              className="sm:text-md block h-40 w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-lg text-gray-200 placeholder-gray-400 shadow-lg shadow-gray-800 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Today, I learned...."
            />
            <div className="flex justify-end">
              <button
                className="m-2 flex rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
                // onClick={SaveNewChanges}
              >
                Create
              </button>
            </div>
            {postBody.length > 0 && <h3>{BadWordFilter.clean(postBody)}</h3>}
          </div>
        </form>
      </div>
    </>
  );
};
export default CreatePost;
