import { api } from "../../../utils/api";
import Loading from "../../Loading";
import { Dispatch, SetStateAction, useState } from "react";
import type { Skill } from "@prisma/client";
import SkilledIn from "./SkilledIn";
import SearchBar from "./SearchBar";
import Tabs from "../../Tabs";

type Tab = "All" | "Your Connections";
const tabList: Tab[] = ["All", "Your Connections"];

const SearchBox: React.FC<{
  changeSearchQuery: Dispatch<
    SetStateAction<
      { searchKeywords: string; requiredSkills: string[] } | undefined
    >
  >;
}> = ({ changeSearchQuery }) => {
  const listInterestsAndSkills = api.me.getAllInterestsAndSkills.useQuery(
    undefined,
    {
      onSuccess: () => {
        if (selectedSkills[0]?.id == "") changeSelectedSkills([]);
      },
    }
  );
  const userData = api.me.data.useQuery();
  const [selectedSkills, changeSelectedSkills] = useState<Skill[]>([
    { id: "", title: "" },
  ]);
  const [searchKeywords, changeSearchKeywords] = useState("");
  const [currentTab, changeCurrentTab] = useState<Tab>("All");

  if (
    !listInterestsAndSkills.data ||
    !userData.data ||
    selectedSkills[0]?.id == ""
  )
    return <Loading />;
  return (
    <>
      <div className="mt-5 flex w-full flex-col rounded-lg bg-gray-700 p-3 sm:mx-4">
        <h3 className="mb-4 text-center text-2xl font-semibold">Search</h3>
        <div className="flex w-full  flex-col gap-3">
          <SearchBar
            changeSearchKeywords={changeSearchKeywords}
            searchKeywords={searchKeywords}
          />

          <SkilledIn
            allSkill={listInterestsAndSkills.data.skills}
            changeSelectedSkill={changeSelectedSkills}
            selectedSkill={selectedSkills}
          />
          <div className="flex justify-end">
            <button
              className="m-2 flex rounded bg-green-600 py-2 px-4 font-bold text-white shadow-sm shadow-green-600 hover:bg-green-600"
              onClick={() => {
                changeSearchQuery({
                  requiredSkills: selectedSkills.map((skill) => skill.id),
                  searchKeywords: searchKeywords,
                });
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <Tabs<Tab>
        changeCurrentTab={(tab) => changeCurrentTab(tab)}
        currentTab={currentTab}
        tabList={tabList}
      />
    </>
  );
};
export default SearchBox;
