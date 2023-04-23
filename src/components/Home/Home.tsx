import type { NextPage } from "next";
import { useState } from "react";
import Tabs from "../Tabs";
import HomePosts from "./Posts";

export type PostsInTab = "Public" | "Following";

const tabList: PostsInTab[] = ["Public", "Following"];

const Home: NextPage = () => {
  const [currentTab, changeCurrentTab] = useState<PostsInTab>("Public");

  return (
    <>
      <div className="m-2 rounded-lg py-3 md:px-3">
        <div className="rounded-lg border-b-4 border-gray-700 text-center text-sm font-bold  text-gray-400">
          <Tabs<PostsInTab>
            changeCurrentTab={(id) => changeCurrentTab(id)}
            currentTab={currentTab}
            tabList={tabList}
          />
        </div>
        <div className="my-4 md:mx-4">
          <HomePosts postsInTab={currentTab} />
        </div>
      </div>
    </>
  );
};

export default Home;
