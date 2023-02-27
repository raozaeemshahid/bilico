import { useEffect, useMemo, useState } from "react";
import { api } from "../../../../../utils/api";
import Image from "next/image";
import moment from "moment";
import BadWordsFilter from "../../../../../utils/BadWordFilter";
import Loading from "../../../../Loading";
import { Interest } from "@prisma/client";
import PreviewNewPost from "./PreviewNewPost";
import CreateNewPost from "./CreateNewPost";

const CreatePost: React.FC = () => {
  const [isCreating, changeIsCreating] = useState(false);
  const [postBody, changePostBody] = useState("");
  const [isInPreview, changeIsInPreview] = useState(false);

  if (!isCreating)
    return (
      <>
        <div className="flex w-full justify-end">
          <button
            className="m-2 flex rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={() => changeIsCreating(true)}
          >
            New
          </button>
        </div>
      </>
    );
  if (isInPreview) {
    return (
      <PreviewNewPost
        changeIsInPreview={changeIsInPreview}
        postBody={postBody}
      />
    );
  }
  return (
    <CreateNewPost
      changeIsCreating={changeIsCreating}
      changeIsInPreview={changeIsInPreview}
      changePostBody={changePostBody}
      postBody={postBody}
    />
  );
};
export default CreatePost;
