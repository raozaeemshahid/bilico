import { api } from "../../../utils/api";
import Loading from "../../Loading";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Skill } from "@prisma/client";
import SkilledIn from "./SkilledIn";
import SearchBar from "./SearchBar";
import Tabs from "../../Tabs";
import type { PeopleSearchQuery } from "..";
import { z } from "zod";
import { toast } from "react-toastify";

export type SearchInTab = "All" | "Connections" | "Trusted";
const tabList: SearchInTab[] = ["All", "Connections", "Trusted"];

const SearchBox: React.FC<{
  searchQuery: PeopleSearchQuery | undefined;
  changeSearchQuery: Dispatch<SetStateAction<PeopleSearchQuery | undefined>>;
}> = ({ changeSearchQuery, searchQuery }) => {
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
  const [currentTab, changeCurrentTab] = useState<SearchInTab>("All");

  const runQuery = () => {
    const parsedKeywords = z
      .string()
      .max(30, { message: "Search keywords can't be so long" })
      .safeParse(searchKeywords);
    if (!parsedKeywords.success) {
      return parsedKeywords.error.errors.forEach((err) =>
        toast.error(err.message)
      );
    }
    changeSearchQuery({
      requiredSkills: selectedSkills.map((skill) => skill.id),
      searchKeywords: searchKeywords,
      searchIn: currentTab,
    });
  };
  useEffect(() => {
    if (!searchQuery) return;
    runQuery();
  }, [currentTab]);
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
          />
          <div className="flex justify-end">
            <button
              className="m-2 flex rounded bg-green-600 py-2 px-4 font-bold text-white shadow-sm shadow-green-600 hover:bg-green-600"
              onClick={runQuery}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <Tabs<SearchInTab>
        changeCurrentTab={(tab) => changeCurrentTab(tab)}
        currentTab={currentTab}
        tabList={tabList}
      />
    </>
  );
};
export default SearchBox;
