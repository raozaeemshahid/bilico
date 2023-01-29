import { type NextPage } from "next";

import { motion } from "framer-motion";
import LeftSideBar from "./leftSidebar";
import RightSideBar from "./rightSidebar";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { LoadingFullScreen } from "../loading";
const Home: NextPage = () => {
  const { data: userSession, status } = useSession();

  const [isLeftBarOpen, changeIsLeftBarOpen] = useState(false);
  const [isRightBarOpen, changeIsRightBarOpen] = useState(false);

  const [isWindowLargerEnough, changeIsWindowLargerThanEnough] =
    useState(false);

  // const deleteMe = trpc.me.deleteMyAccount.useMutation();
  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated",
  });

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

  useEffect(() => {
    if (isWindowLargerEnough) {
      changeIsLeftBarOpen(true);
      changeIsRightBarOpen(true);
    } else {
      changeIsLeftBarOpen(false);
      changeIsRightBarOpen(false);
    }
  }, [isWindowLargerEnough]);

  if (!userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;
  if (!userInfo.data || !userInfo.data.success)
    return <LoadingFullScreen text="Getting Things Ready" />;
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
            userInfo={{
              name: userInfo.data.name,
              newMessages: userInfo.data.newMessages,
              newNotifications: userInfo.data.newNotifications,
              newRequests: userInfo.data.newRequests,
            }}
          />
          <motion.div
            className={`absolute left-0 right-0 z-[18] m-6 rounded-xl bg-gray-800 p-5 text-gray-100 md:static md:w-full`}
          >
            Lorem
          </motion.div>

          <RightSideBar
            isOpen={isRightBarOpen}
            changeIsOpen={changeIsRightBarOpen}
            isWindowLargerEnough={isWindowLargerEnough}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
