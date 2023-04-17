import { useState, useEffect } from "react";
import PreviewNewPost from "./PreviewNewPost";
import CreateNewPost from "./CreateNewPost";
import { api } from "../../../../../utils/api";
import type { Interest } from "@prisma/client";
import { toast } from "react-toastify";
import zodPost from "../../../../../lib/zod/zodPost";

const CreatePost: React.FC = () => {
  const [postBody, changePostBody] = useState("");
  const [isInPreview, changeIsInPreview] = useState(false);

  const utilsApi = api.useContext();
  const [interestsFoundInPost, changeInterestsFound] = useState<Interest[]>([
    { id: "", title: "" },
  ]);

  useEffect(() => {
    if (isInPreview) return;
    changeInterestsFound([{ id: "", title: "" }]);
  }, [isInPreview]);

  const createPostMutation = api.me.createPost.useMutation();
  const createPost = () => {
    const parsedPost = zodPost.safeParse(postBody);
    if (!parsedPost.success)
      return parsedPost.error.errors.forEach((err) => toast.error(err.message));
    changeInterestsFound([{ id: "", title: "" }]);
    changeIsInPreview(false);
    changePostBody("");
    void toast.promise(
      createPostMutation
        .mutateAsync({
          postBody,
          interests: interestsFoundInPost.map((interest) => interest.id),
        })
        .then(() => utilsApi.me.getPosts.invalidate()),
      {
        success: "Post is Created",
        error: "Couldn't Create Post",
        pending: "Creating Post",
      }
    );
  };

  if (isInPreview) {
    return (
      <PreviewNewPost
        createPost={createPost}
        changeIsInPreview={changeIsInPreview}
        postBody={postBody}
        changeInterestsFound={changeInterestsFound}
        interestsFoundInPost={interestsFoundInPost}
      />
    );
  }
  return (
    <CreateNewPost
      changeIsInPreview={changeIsInPreview}
      changePostBody={changePostBody}
      postBody={postBody}
    />
  );
};
export default CreatePost;
