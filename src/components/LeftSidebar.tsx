import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const GrDrag = dynamic(() =>
  import("react-icons/gr").then((icons) => icons.GrDrag)
);

import { NavbarLinkCreator } from "../lib/NavbarLinkProvider";
import SidebarLink from "./SidebarLink";
import type { UserInfo } from "./HomeLayout";
import { useRouter } from "next/router";
import PagesLinks from "../lib/PagesLink";
import { useSession } from "next-auth/react";
import Loading from "./Loading";

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
  const router = useRouter();
  const { data: userSession } = useSession();

  useEffect(() => {
    if (!SideBarRef.current) return;
    changeSideBarNavbarWidth(SideBarRef.current.clientWidth);
  }, [isSideBarReady]);
  if (!userSession || !userSession.user) return <Loading />;
  return (
    <div
      className={` ${
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
        <div className="mt-3 flex h-screen w-full flex-col gap-4 p-3 py-5">
          <SidebarLink
            link={NavbarLinkCreator.HomeLink()}
            isActive={router.route === "/"}
          />
          <SidebarLink
            count={userInfo.newMessages}
            link={NavbarLinkCreator.MessageLink()}
            isActive={router.route == PagesLinks.getMessageLink()}
          />
          <SidebarLink
            link={NavbarLinkCreator.PeoplesLink()}
            isActive={router.route == PagesLinks.getPeoplesLink()}
          />
          <SidebarLink
            count={userInfo.newRequests}
            link={NavbarLinkCreator.RequestsLink()}
            isActive={router.route == PagesLinks.REQUESTS_LINK}
          />
          <SidebarLink
            count={userInfo.newNotifications}
            link={NavbarLinkCreator.NotificationLink()}
            isActive={router.route == PagesLinks.NOTIFICATION_LINK}
          />
          <SidebarLink
            link={NavbarLinkCreator.accountLink(userSession)}
            isActive={router.route == PagesLinks.ME}
          />
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
