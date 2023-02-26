import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

import LeftSideBar from "./LeftSidebar";
import RightSideBar from "./RightSidebar";

export interface UserInfo {
  name: string;
  newMessages: number;
  newNotifications: number;
  newRequests: number;
}

const HomeLayout: React.FC<{
  includeRightBar?: boolean;
  userInfo: UserInfo;
  children: string | JSX.Element;
}> = ({ includeRightBar = false, userInfo, children }) => {
  const [isLeftBarOpen, changeIsLeftBarOpen] = useState(true);
  const [isRightBarOpen, changeIsRightBarOpen] = useState(true);

  const [isAllClosed, changeIsAllClosed] = useState(false);

  const [isWindowLargerEnough, changeIsWindowLargerThanEnough] =
    useState(false);

  useEffect(() => {
    const setToggler = () => {
      const isWindowLarger = window.innerWidth >= 768;
      changeIsWindowLargerThanEnough(isWindowLarger);
      if (isWindowLarger) {
        changeIsLeftBarOpen(true);
        changeIsRightBarOpen(true);
      } else {
        changeIsLeftBarOpen(false);
        changeIsRightBarOpen(false);
      }
    };
    setToggler();
    window.addEventListener("resize", setToggler);
  }, []);
  return (
    <>
      <div className="h-screen overflow-x-hidden bg-gray-700">
        <Navbar />

        <div className="relative mt-2 flex h-full w-full">
          {(isLeftBarOpen || isRightBarOpen) && !isWindowLargerEnough && (
            <motion.div
              className="absolute top-0 left-0 z-[25] h-screen w-screen opacity-0"
              onClick={() => {
                changeIsLeftBarOpen(false);
                changeIsRightBarOpen(false);
              }}
              animate={{ width: "100vw" }}
            ></motion.div>
          )}
          <LeftSideBar
            isOpen={isLeftBarOpen}
            changeIsOpen={changeIsLeftBarOpen}
            isWindowLargerEnough={isWindowLargerEnough}
            userInfo={userInfo}
            changeIsAllClosed={changeIsAllClosed}
          />
          <motion.div
            className={`absolute left-0 right-0 ${
              isAllClosed && !isLeftBarOpen && !isRightBarOpen ? "z-30" : "z-10"
            } m-5 rounded-xl bg-gray-800 p-2 py-5 md:static md:w-full`}
          >
            {children}
          </motion.div>

          {includeRightBar && (
            <RightSideBar
              isOpen={isRightBarOpen}
              changeIsOpen={changeIsRightBarOpen}
              isWindowLargerEnough={isWindowLargerEnough}
              changeIsAllClosed={changeIsAllClosed}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
