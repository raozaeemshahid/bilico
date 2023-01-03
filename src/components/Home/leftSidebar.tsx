import { motion, useDragControls } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { GrDrag } from "react-icons/gr";

let isDragging = false;

const Sidebar: React.FC<{
  isOpen: boolean;
  changeIsOpen: Dispatch<SetStateAction<boolean>>;
  isOtherOpen: boolean;
  isWindowLargerEnough: boolean;
}> = ({ isOpen, changeIsOpen, isOtherOpen, isWindowLargerEnough }) => {
  const [sideNavbarWidth, changeSideBarNavbarWidth] = useState(0);
  const [isSideBarReady, changeIsSideBarReady] = useState(false);

  const SideBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SideBarRef.current) return;
    changeSideBarNavbarWidth(SideBarRef.current.clientWidth);
  }, [isSideBarReady]);

  return (
    <>
      {isOpen && !isWindowLargerEnough && (
        <motion.div
          className="absolute top-0 left-0 z-20 h-screen w-screen opacity-0"
          onClick={() => changeIsOpen(false)}
          animate={{ width: "100vw" }}
        ></motion.div>
      )}
      <div
        className={`absolute z-[3] md:static ${!isOtherOpen && `z-[6]`} ${
          isOpen ? `z-30` : ""
        } left-0 flex h-screen overflow-x-hidden md:overflow-x-visible`}
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
        ></motion.div>
        {!isWindowLargerEnough && (
          <motion.button
            className="bg-gray-600 p-[0.1]"
            initial={{ x: isOpen ? 0 : -sideNavbarWidth }}
            animate={{
              x: isOpen ? 0 : -sideNavbarWidth,
            }}
            onClick={(e) => {
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
    </>
  );
};

export default Sidebar;
