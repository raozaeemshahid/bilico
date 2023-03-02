import { useState } from "react";
import PreviewNewPost from "./PreviewNewPost";
import CreateNewPost from "./CreateNewPost";
import { api } from "../../../../../utils/api";
import { Interest } from "@prisma/client";
import Loading from "../../../../Loading";
import { zodPost } from "../../../../../lib/zod";
const CreatePost: React.FC = () => {
  const [isCreating, changeIsCreating] = useState(false);
  const [postBody, changePostBody] = useState("");
  const [isInPreview, changeIsInPreview] = useState(false);
  const [errors, changeErrors] = useState<string[] | undefined>();
  const utilsApi = api.useContext()
  const allInterests = api.me.getAllInterestsAndSkills.useQuery({
    includeSkill: false,
  });
  const [interestsFoundInPost, changeInterestsFound] = useState<Interest[]>([
    { id: "", title: "" },
  ]);
  const createPostMutation = api.me.createPost.useMutation({
    onSuccess: () => {
      utilsApi.me.getPosts.invalidate()
      changePostBody("");
      changeIsInPreview(false);
      changeInterestsFound([{ id: "", title: "" }]);
      changeIsCreating(false);
    },
    onError: (err) => {
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
      changeIsCreating={changeIsCreating}
      changeIsInPreview={changeIsInPreview}
      changePostBody={changePostBody}
      postBody={postBody}
    />
  );
};
export default CreatePost;
