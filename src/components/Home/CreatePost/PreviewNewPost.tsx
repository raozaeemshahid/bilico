import type { Dispatch, SetStateAction } from "react";
import type { Interest } from "@prisma/client";
import Image from "next/image";
import moment from "moment";
import InterestFound from "./InterestsFound";
import PublishPost from "./PublishPost";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import BadWordsFilter from "../../../utils/BadWordFilter";

const PreviewNewPost: React.FC<{
  postBody: string;
  changeIsInPreview: Dispatch<SetStateAction<boolean>>;
  interestsFoundInPost: Interest[];
  changeInterestsFound: Dispatch<SetStateAction<Interest[]>>;
  createPost: () => void;
}> = ({
  postBody,
  changeIsInPreview,
  changeInterestsFound,
  interestsFoundInPost,
  createPost,
}) => {
  const userData = api.me.data.useQuery();
  if (!userData.data) return <Loading />;
  return (
    <>
      <div className="m-2 w-full rounded-lg bg-gray-700 p-3 px-4">
        <div className="flex justify-center">
          <h2 className="text-2xl font-bold text-gray-200">Preview</h2>
        </div>
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div>
              {!!userData.data.image && (
                <Image
                  alt="Profile Pic"
                  className="rounded-full"
                  width={40}
                  height={40}
                  src={userData.data.image}
                />
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="text-md">{userData.data.name}</h3>
              <h3 className="text-sm text-gray-100 opacity-80">
                {moment().fromNow()}
              </h3>
            </div>
          </div>
          <h4 className="m-2 my-4 flex flex-col gap-2 text-base">
            {postBody.split("\n").map((paragaraph) => {
              if (paragaraph.length == 0) return null;
              return (
                <span key={`${Math.random()}`}>
                  {BadWordsFilter.clean(paragaraph)}
                </span>
              );
            })}
          </h4>
        </div>
        <InterestFound
          postBody={postBody}
          changeInterestsFound={changeInterestsFound}
          interestsFoundInPost={interestsFoundInPost}
        />
        <PublishPost
          changeIsInPreview={changeIsInPreview}
          postBody={postBody}
          createPost={createPost}
        />
      </div>
    </>
  );
};
export default PreviewNewPost;
