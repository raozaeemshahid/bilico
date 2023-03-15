import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

import LeftSideBar from "./LeftSidebar";

export interface UserInfo {
  name: string;
  newMessages: number;
  newNotifications: number;
  newRequests: number;
}

const HomeLayout: React.FC<{
  userInfo: UserInfo;
  children: string | JSX.Element | JSX.Element[];
}> = ({  userInfo, children }) => {
  const [isLeftBarOpen, changeIsLeftBarOpen] = useState(true);

  const [isAllClosed, changeIsAllClosed] = useState(false);

  const [isWindowLargerEnough, changeIsWindowLargerThanEnough] =
    useState(false);

  useEffect(() => {
    const setToggler = () => {
      const isWindowLarger = window.innerWidth >= 768;
      changeIsWindowLargerThanEnough(isWindowLarger);
      if (isWindowLarger) {
        changeIsLeftBarOpen(true);
      } else {
        changeIsLeftBarOpen(false);
      }
    };
    setToggler();
    window.addEventListener("resize", setToggler);
  }, []);
  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-gray-700">
        <div className="invisible">
          {/* For Alignment due to fixed navbar */}
          <Navbar />
        </div>
        <div className="fixed top-0 z-40 w-full">
          <Navbar />
        </div>

        <div className="relative mt-2 flex h-full w-full">
          {isLeftBarOpen  && !isWindowLargerEnough && (
            <motion.div
              className="fixed top-0 left-0 z-[25] h-screen w-screen opacity-0"
              onClick={() => {
                changeIsLeftBarOpen(false);
              }}
              animate={{ width: "100vw" }}
            ></motion.div>
          )}
          {isWindowLargerEnough && (
            <div className="invisible">
              {/* For Alignment due to fixed navbar */}
              <LeftSideBar
                isOpen={isLeftBarOpen}
                changeIsOpen={changeIsLeftBarOpen}
                isWindowLargerEnough={isWindowLargerEnough}
                userInfo={userInfo}
                changeIsAllClosed={changeIsAllClosed}
              />
            </div>
          )}
          <div className={`fixed ${isLeftBarOpen ? "z-[27]" : "z-20"} `}>
            <LeftSideBar
              isOpen={isLeftBarOpen}
              changeIsOpen={changeIsLeftBarOpen}
              isWindowLargerEnough={isWindowLargerEnough}
              userInfo={userInfo}
              changeIsAllClosed={changeIsAllClosed}
            />
          </div>
          <motion.div
            className={`${
              isAllClosed && !isLeftBarOpen  ? "z-30" : "z-10"
            } my-5 ml-4 rounded-xl bg-gray-800 p-2 py-5 xs:mx-5 w-full`}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
