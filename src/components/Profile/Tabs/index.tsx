import { useState } from "react";
import dynamic from "next/dynamic";
import Loading from "../../Loading";
import Tabs from "../../Tabs";

export const sleepInSeconds = async (seconds: number) => {
  await new Promise((res) => setTimeout(() => res("Resolved"), seconds * 1000));
};

const Posts = dynamic(() => import("./Posts"), { loading: () => <Loading /> });
const Work = dynamic(() => import("./Work"), { loading: () => <Loading /> });
const Questions = dynamic(() => import("./Questions"), {
  loading: () => <Loading />,
});
const Answers = dynamic(() => import("./Answer"), {
  loading: () => <Loading />,
});

type Tab = "Posts" | "Work" | "Questions" | "Answers";

const tabList: Tab[] = ["Posts", "Work", "Questions", "Answers"];

const ProfileTabs: React.FC = () => {
  const [currentTab, changeCurrentTab] = useState<Tab>("Posts");

  return (
    <>
      <div className="m-2 rounded-lg py-3 md:px-3">
        <div className="rounded-lg border-b-4 border-gray-700 text-center text-sm font-bold  text-gray-400">
          <Tabs<Tab>
            changeCurrentTab={(id) => changeCurrentTab(id)}
            currentTab={currentTab}
            tabList={tabList}
          />
        </div>
        <div className="my-4 md:mx-4">
          {currentTab === "Posts" && <Posts />}
          {currentTab === "Work" && <Work />}
          {currentTab === "Questions" && <Questions />}
          {currentTab === "Answers" && <Answers />}
        </div>
      </div>
    </>
  );
};

export default ProfileTabs;
