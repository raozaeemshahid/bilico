import { motion } from "framer-motion";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { GrDrag } from "react-icons/gr";
import { NavbarLinkCreator } from "../lib/NavbarLinkProvider";
import SidebarLink from "./SidebarLink";
import { UserInfo } from "./HomeLayout";

let isDragging = false;

const Sidebar: React.FC<{
  isOpen: boolean;
  changeIsOpen: Dispatch<SetStateAction<boolean>>;
  isOtherOpen: boolean;
  isWindowLargerEnough: boolean;
  userInfo: UserInfo;
}> = ({
  isOpen,
  changeIsOpen,
  isOtherOpen,
  isWindowLargerEnough,
  userInfo,
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
      className={` relative z-[3] md:static ${!isOtherOpen && `z-[6]`} ${
        isOpen && `z-30`
      } left-0 flex md:overflow-x-visible`}
    >
      <motion.div
        className="flex rounded-md bg-gray-800"
        initial={{ x: isOpen ? 0 : -sideNavbarWidth, width: 0 }}
        onAnimationComplete={() => {
          if (sideNavbarWidth === SideBarRef.current?.clientWidth) return;
          changeIsSideBarReady(true);
        }}
        animate={{
          x: isOpen ? 0 : -sideNavbarWidth,
          width: "12rem",
        }}
        ref={SideBarRef}
      >
        <div className="flex w-full flex-col  p-3 py-5">
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
          <SidebarLink link={NavbarLinkCreator.BlogLink()} />
          <SidebarLink link={NavbarLinkCreator.questionLink()} />
          <SidebarLink link={NavbarLinkCreator.storyLink()} />
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
