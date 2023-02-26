import { useState } from "react";
import dynamic from "next/dynamic";
import Loading from "../../Loading";

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
const Tab: React.FC<{
  isActive: boolean;
  text: Tab;
  switchTab: (id: Tab) => void;
}> = ({ isActive = false, text, switchTab }) => {
  return (
    <>
      <li className="mr-2">
        {isActive ? (
          <span
            className="active inline-block shadow-lg shadow-gray-700 rounded-t-lg border-4 border-y-0 border-gray-700 bg-gray-700 p-4 py-3 text-gray-300"
            aria-current="page"
          >
            {text}
          </span>
        ) : (
          <button
            onClick={() => switchTab(text)}
            className="inline-block shadow-lg shadow-gray-700 rounded-t-lg border-4 border-y-0 border-gray-700 p-4 py-3 text-gray-100  hover:bg-gray-500 hover:text-gray-300"
          >
            {text}
          </button>
        )}
      </li>
    </>
  );
};

const tabList: Tab[] = ["Posts", "Work", "Questions", "Answers"];
const Tabs: React.FC = () => {
  const [currentTab, changeCurrentTab] = useState<Tab>("Posts");

  return (
    <>
      <div className="m-2 rounded-lg bg-gray-600 p-3">
        <div className="rounded-lg border-b-4 border-gray-700 text-center text-sm font-bold  text-gray-400">
          <ul className="-mb-px flex flex-wrap justify-center">
            {tabList.map((tab) => (
              <Tab
                text={tab}
                isActive={tab === currentTab}
                switchTab={(id) => changeCurrentTab(id)}
                key={tab}
              />
            ))}
          </ul>
        </div>
        <div className="m-4">
          {currentTab === "Posts" && <Posts />}
          {currentTab === "Work" && <Work />}
          {currentTab === "Questions" && <Questions />}
          {currentTab === "Answers" && <Answers />}
        </div>
      </div>
    </>
  );
};

export default Tabs;
