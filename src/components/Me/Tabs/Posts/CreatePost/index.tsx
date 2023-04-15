import { useState, useEffect } from "react";
import PreviewNewPost from "./PreviewNewPost";
import CreateNewPost from "./CreateNewPost";
import { api } from "../../../../../utils/api";
import type { Interest } from "@prisma/client";
import { zodPost } from "../../../../../lib/zod";
import { toast } from "react-toastify";

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

  const createPostMutation = api.me.createPost.useMutation({
    onSuccess: () => {
      void toast.promise(utilsApi.me.getPosts.invalidate(), {
        error: "Couldn't Reload Posts",
        pending: "Reloading Posts",
        success: "Posts Reloaded",
      });
    },
  });
  const createPost = () => {
    const post = zodPost.safeParse(postBody);
    if (post.success) {
      changeInterestsFound([{ id: "", title: "" }]);
      changeIsInPreview(false);
      changePostBody("");
      void toast.promise(
        createPostMutation.mutateAsync({
          postBody,
          interests: interestsFoundInPost.map((interest) => interest.id),
        }),
        {
          success: "Post is Created",
          error: "Couldn't Create Post",
          pending: "Creating Post...",
        }
      );
    } else post.error.errors.forEach((err) => toast.error(err.message));
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
