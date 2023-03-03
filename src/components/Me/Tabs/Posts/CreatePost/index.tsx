import { useState } from "react";
import PreviewNewPost from "./PreviewNewPost";
import CreateNewPost from "./CreateNewPost";
import { api } from "../../../../../utils/api";
import { Interest } from "@prisma/client";
import Loading from "../../../../Loading";
import { zodPost } from "../../../../../lib/zod";
const CreatePost: React.FC = () => {
  const [postBody, changePostBody] = useState("");
  const [isInPreview, changeIsInPreview] = useState(false);
  const [errors, changeErrors] = useState<string[] | undefined>();
  const utilsApi = api.useContext()
  const [interestsFoundInPost, changeInterestsFound] = useState<Interest[]>([
    { id: "", title: "" },
  ]);
  const createPostMutation = api.me.createPost.useMutation({
    onSuccess: () => {
      utilsApi.me.getPosts.invalidate()
      changePostBody("");
      changeIsInPreview(false);
      changeInterestsFound([{ id: "", title: "" }]);
    },
    onError: () => {
      changeErrors(["Something went wrong"]);
    },
  });
  const createPost = () => {
    const post = zodPost.safeParse(postBody);
    if (post.success)
      createPostMutation.mutate({
        postBody,
        interests: interestsFoundInPost.map((interest) => interest.id),
      });
    else changeErrors(post.error.errors.map((err) => err.message));
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
        errors={errors}
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
