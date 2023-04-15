import PagesLinks from "./PagesLink";
import type { IconBaseProps } from "react-icons";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Session } from "next-auth";

const VscAccount = dynamic(() =>
  import("react-icons/vsc").then((icons) => icons.VscAccount)
);
// const MdForum = dynamic(() =>
//   import("react-icons/md").then((icons) => icons.MdForum)
// );
const MdNotifications = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdNotifications)
);
const TbMessage = dynamic(() =>
  import("react-icons/tb").then((icons) => icons.TbMessage)
);
const FaHome = dynamic(() =>
  import("react-icons/fa").then((icons) => icons.FaHome)
);
const IoIosPeople = dynamic(() =>
  import("react-icons/io").then((icons) => icons.IoIosPeople)
);

export interface LinkType {
  Text: string;
  href: string;
  icon: ComponentType<IconBaseProps>;
}

export const NavbarLinkCreator = {
  profileLink: (userName: string): LinkType => {
    return {
      Text: userName,
      href: PagesLinks.ME,
      icon: VscAccount,
    };
  },
  accountLink: (session: Session): LinkType => {
    let name = "Account";
    (() => {
      if (!session.user || !session.user.name) return;
      const splittedName = session.user.name.split(" ");
      const firstName = splittedName[0];
      if (!firstName) return;
      const secondName = splittedName[1] || "";
      const fullName = (firstName + " " + secondName).trim();
      if (fullName.length <= 10) name = fullName;
      else name = firstName;
    })();
    return {
      Text: name,
      href: PagesLinks.ME,
      icon: VscAccount,
    };
  },
  HomeLink: (): LinkType => {
    return {
      Text: "Home",
      href: PagesLinks.HOME_Link,
      icon: FaHome,
    };
  },
  NotificationLink: (): LinkType => {
    return {
      Text: "Notifications",
      href: PagesLinks.NOTIFICATION_LINK,
      icon: MdNotifications,
    };
  },
  MessageLink: (): LinkType => {
    return {
      Text: "Messages",
      href: PagesLinks.NOTIFICATION_LINK,
      icon: TbMessage,
    };
  },
  PeoplesLink: (): LinkType => {
    return {
      Text: "Peoples",
      href: PagesLinks.getPeoplesLink(),
      icon: IoIosPeople,
    };
  },
};
