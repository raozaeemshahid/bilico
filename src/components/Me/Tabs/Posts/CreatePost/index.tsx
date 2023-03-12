import { useState, useEffect } from "react";
import PreviewNewPost from "./PreviewNewPost";
import CreateNewPost from "./CreateNewPost";
import { api } from "../../../../../utils/api";
import type { Interest } from "@prisma/client";
import Loading from "../../../../Loading";
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
      void utilsApi.me.getPosts.invalidate();
    },
    onError: () => {
      toast.error("Couldn't create post");
    },
  });
  const createPost = () => {
    const post = zodPost.safeParse(postBody);
    if (post.success) {
      changeInterestsFound([{ id: "", title: "" }]);
      changeIsInPreview(false);
      changePostBody("");
      createPostMutation.mutate({
        postBody,
        interests: interestsFoundInPost.map((interest) => interest.id),
      });
    } else post.error.errors.forEach((err) => toast.error(err.message));
  };
  if (createPostMutation.isLoading) return <Loading text="Creating" />;

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
