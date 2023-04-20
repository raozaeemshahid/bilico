import dynamic from "next/dynamic";
import { useState } from "react";
import Loading from "../Loading";
import Tabs from "../Tabs";

const Comments = dynamic(() => import("./Comments"), {
  loading: () => <Loading />,
});
const Reactions = dynamic(() => import("./Reactions"), {
  loading: () => <Loading />,
});

type Tab = "Reactions" | "Comments & Replies";
const tabList: Tab[] = ["Reactions", "Comments & Replies"];
const Activity: React.FC = () => {
  const [currentTab, changeCurrentTab] = useState<Tab>();
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
          {currentTab === "Reactions" && <Reactions />}
          {currentTab === "Comments & Replies" && <Comments />}
        </div>
      </div>
    </>
  );
};
export default Activity;
