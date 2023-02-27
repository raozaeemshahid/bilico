import { motion } from "framer-motion";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";

const GrDrag = dynamic(() =>
  import("react-icons/gr").then((icons) => icons.GrDrag)
);

import { NavbarLinkCreator } from "../lib/NavbarLinkProvider";
import SidebarLink from "./SidebarLink";
import { type UserInfo } from "./HomeLayout";

let isDragging = false;

const Sidebar: React.FC<{
  isOpen: boolean;
  changeIsOpen: Dispatch<SetStateAction<boolean>>;
  changeIsAllClosed: Dispatch<SetStateAction<boolean>>;
  isWindowLargerEnough: boolean;
  userInfo: UserInfo;
}> = ({
  isOpen,
  changeIsOpen,
  isWindowLargerEnough,
  userInfo,
  changeIsAllClosed,
}) => {
  const [sideNavbarWidth, changeSideBarNavbarWidth] = useState(0);
  const [isSideBarReady, changeIsSideBarReady] = useState(false);
  const SideBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SideBarRef.current) return;
    changeSideBarNavbarWidth(SideBarRef.current.clientWidth);
  }, [isSideBarReady]);
  return (
    <div
      className={` absolute left-0 ${
        isOpen ? "z-[27]" : "z-20"
      } flex overflow-x-hidden md:static md:overflow-x-visible`}
    >
      <motion.div
        className="flex rounded-md  bg-gray-800"
        initial={{ x: isOpen ? 0 : -sideNavbarWidth, width: 0 }}
        onAnimationComplete={() => {
          if (!isOpen) changeIsAllClosed(true);
          if (sideNavbarWidth === SideBarRef.current?.clientWidth) return;
          changeIsSideBarReady(true);
        }}
        onAnimationStart={() => changeIsAllClosed(false)}
        animate={{
          x: isOpen ? 0 : -sideNavbarWidth,
          width: "12rem",
        }}
        ref={SideBarRef}
      >
        <div className="flex h-screen w-full flex-col  p-3 py-5">
          <SidebarLink link={NavbarLinkCreator.HomeLink()} />
          <SidebarLink
            count={userInfo.newMessages}
            link={NavbarLinkCreator.MessageLink()}
          />
          <SidebarLink
            count={userInfo.newRequests}
            link={NavbarLinkCreator.ConnectionLink()}
          />
          <SidebarLink
            count={userInfo.newNotifications}
            link={NavbarLinkCreator.NotificationLink()}
          />
          <SidebarLink link={NavbarLinkCreator.questionLink()} />
          <SidebarLink link={NavbarLinkCreator.accountLink()} />
        </div>
      </motion.div>
      {!isWindowLargerEnough && (
        <motion.button
          className="bg-gray-600 p-[0.1]"
          initial={{ x: isOpen ? 0 : -sideNavbarWidth }}
          animate={{
            x: isOpen ? 0 : -sideNavbarWidth,
          }}
          onClick={() => {
            if (isDragging) return;
            changeIsOpen(!isOpen);
          }}
          onPanStart={() => (isDragging = true)}
          onPanEnd={() =>
            setTimeout(() => {
              isDragging = false;
            }, 10)
          }
          onPan={(e, info) => {
            if (info.offset.x < -50 && isOpen) changeIsOpen(false);
            if (info.offset.x > 50 && !isOpen) changeIsOpen(true);
          }}
        >
          <GrDrag />
        </motion.button>
      )}
    </div>
  );
};

export default Sidebar;
