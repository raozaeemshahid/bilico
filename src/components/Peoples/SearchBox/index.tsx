import { api } from "../../../utils/api";
import Loading from "../../Loading";
import { useState } from "react";
import { Interest } from "@prisma/client";
import SkilledIn from "./SkilledIn";

const SearchBox: React.FC = () => {
  const listInterestsAndSkills = api.me.getAllInterestsAndSkills.useQuery();
  const userData = api.me.data.useQuery(undefined, {
    onSuccess: (data) => {
      changeSelectedInterests(data.Interests);
      changeSelectedSkills(data.Skills);
    },
  });
  const [selectedInterests, changeSelectedInterests] = useState<Interest[]>([
    { id: "", title: "" },
  ]);
  const [selectedSkills, changeSelectedSkills] = useState<Interest[]>([
    { id: "", title: "" },
  ]);

  if (
    !listInterestsAndSkills.data ||
    !userData.data ||
    selectedInterests[0]?.id == ""
  )
    return <Loading />;
  return (
    <>
      <div className="mt-5 flex w-full flex-col rounded-lg bg-gray-700 p-3 sm:mx-4">
        <h3 className="mb-2 text-center text-xl font-semibold">Search</h3>
        <div className="flex flex-wrap sm:flex-nowrap items-center">
          <h2 className="whitespace-nowrap text-lg">Skilled In</h2>
          <SkilledIn
            allSkill={listInterestsAndSkills.data.skills}
            changeSelectedSkill={changeSelectedSkills}
            selectedSkill={selectedSkills}
          />
        </div>
      </div>
    </>
  );
};
export default SearchBox;
