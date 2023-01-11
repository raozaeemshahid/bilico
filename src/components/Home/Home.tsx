import { type NextPage } from "next";

import { motion } from "framer-motion";
import LeftSideBar from "./leftSidebar";
import RightSideBar from "./rightSidebar";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { LoadingFullScreen } from "../loading";
const Home: NextPage = () => {
  const { data: userSession, status } = useSession();

  const [isLeftBarOpen, changeIsLeftBarOpen] = useState(false);
  const [isRightBarOpen, changeIsRightBarOpen] = useState(false);

  const [isWindowLargerEnough, changeIsWindowLargerThanEnough] =
    useState(false);

  // const deleteMe = trpc.me.deleteMyAccount.useMutation();
  const userInfo = trpc.me.info.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  useEffect(() => {
    const setToggler = () => {
      const isWindowLarger = window.innerWidth >= 768;
      changeIsWindowLargerThanEnough(isWindowLarger);
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
      <div className="overflow-hidden bg-gray-700">
        <Navbar />

        <div className="mt-1 flex">
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
            className={`m-10 w-full rounded-xl bg-gray-800 p-5 text-gray-100`}
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
