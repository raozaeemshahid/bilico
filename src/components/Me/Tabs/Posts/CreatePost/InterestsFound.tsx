import { Dispatch, SetStateAction, useEffect } from "react";
import { api } from "../../../../../utils/api";
import { Interest } from "@prisma/client";
import Select from "react-select";
import Loading from "../../../../Loading";

const InterestFound: React.FC<{
  postBody: string;
  interestsFoundInPost: Interest[];
  changeInterestsFound: Dispatch<SetStateAction<Interest[]>>;
}> = ({ postBody, changeInterestsFound, interestsFoundInPost }) => {
  const allInterests = api.me.getAllInterestsAndSkills.useQuery({
    includeSkill: false,
  });
  useEffect(() => {
    if (!allInterests.isSuccess) return;
    const loweredPostBody = postBody.toLowerCase();
    let words = [
      ...loweredPostBody.split(/(?:,| |\/)+/),
      ...loweredPostBody.split(" "),
    ];
    const interestsFound: string[] = [];
    allInterests.data.interests.forEach((interest) => {
      const title = interest.title.toLowerCase();
      if (words.includes(title) || loweredPostBody.includes(` ${title} `))
        interestsFound.push(interest.title.toLowerCase());
    });
    changeInterestsFound(
      allInterests.data.interests.filter((interest) =>
        interestsFound.includes(interest.title.toLowerCase())
      )
    );
  }, [allInterests.isSuccess]);
  if (!allInterests.isSuccess || interestsFoundInPost[0]?.id === "")
    return <Loading />;
  return (
    <div className="m-1 mt-3">
      <div className="flex items-center gap-1">
        <h2 className="text-lg font-bold text-gray-200">Interests </h2>
        <Select
          onChange={(interests) =>
            changeInterestsFound(
              [...interests].map((interest) => ({
                id: interest.value,
                title: interest.label,
              }))
            )
          }
          styles={{
            option: (style) => ({ ...style, color: "black" }),
            control: (style) => ({
              ...style,
              border: "0px",
              backgroundColor: "transparent",
            }),
            multiValue: (style) => ({
              ...style,
              backgroundColor: "rgb(22, 163, 74)",
              fontSize: "15px",
              padding: "3px",
              fontWeight: "600",
              borderRadius: "8px",
            }),
            multiValueLabel: (style) => ({
              ...style,
              color: "rgb(243, 244, 246)",
            }),
          }}
          classNames={{
            control: () => "p-1",
            multiValue: () => "text-gray-100",
          }}
          // className="p-11"
          defaultValue={interestsFoundInPost.map((interest) => ({
            label: interest.title,
            value: interest.id,
          }))}
          isMulti={true}
          name="Interests"
          options={allInterests.data.interests
            .sort(
              (a, b) =>
                a.title.toLowerCase().charCodeAt(0) -
                b.title.toLowerCase().charCodeAt(0)
            )
            .map((interest) => ({
              label: interest.title,
              value: interest.id,
            }))}
        />
      </div>
    </div>
  );
};
export default InterestFound;
