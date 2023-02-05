import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

import LeftSideBar from "./LeftSidebar";
import RightSideBar from "./RightSidebar";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";

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
  const [isLeftBarOpen, changeIsLeftBarOpen] = useState(false);
  const [isRightBarOpen, changeIsRightBarOpen] = useState(false);

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
      <div className="h-screen overflow-hidden bg-gray-700">
        <Navbar />

        <div className="relative mt-2 flex h-full w-full">
          {(isLeftBarOpen || isRightBarOpen) && !isWindowLargerEnough && (
            <motion.div
              className="absolute top-0 left-0 z-30 h-screen w-screen opacity-0"
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
            isOtherOpen={isRightBarOpen}
            isWindowLargerEnough={isWindowLargerEnough}
            userInfo={userInfo}
          />
          <motion.div
            className={`absolute left-0 right-0 z-[18] m-6 rounded-xl bg-gray-800 p-5 text-gray-100 md:static md:w-full`}
          >
            {children}
          </motion.div>

          {includeRightBar && (
            <RightSideBar
              isOpen={isRightBarOpen}
              changeIsOpen={changeIsRightBarOpen}
              isWindowLargerEnough={isWindowLargerEnough}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HomeLayout;