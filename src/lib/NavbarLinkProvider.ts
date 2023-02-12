import PagesLinks from "./PagesLink";
import { type IconBaseProps, type IconType } from "react-icons";

import dynamic from "next/dynamic";
import { type ComponentType } from "react";

const VscAccount = dynamic(() =>
  import("react-icons/vsc").then((icons) => icons.VscAccount)
);
const MdForum = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdForum)
);
const TbWriting = dynamic(() =>
  import("react-icons/tb").then((icons) => icons.TbWriting)
);
const MdNotifications = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdNotifications)
);
const TbMessage = dynamic(() =>
  import("react-icons/tb").then((icons) => icons.TbMessage)
);
const ImBlog = dynamic(() =>
  import("react-icons/im").then((icons) => icons.ImBlog)
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
  accountLink: (): LinkType => {
    return {
      Text: "Account",
      href: PagesLinks.ME,
      icon: VscAccount,
    };
  },
  questionLink: (): LinkType => {
    return {
      Text: "Q/Answers",
      href: PagesLinks.getQuestionLink(),
      icon: MdForum,
    };
  },
  storyLink: (): LinkType => {
    return {
      Text: "Stories",
      href: PagesLinks.getStoryLink(),
      icon: TbWriting,
    };
  },
  BlogLink: (): LinkType => {
    return {
      Text: "Blogs",
      href: PagesLinks.getBlogLink(),
      icon: ImBlog,
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
  ConnectionLink: (): LinkType => {
    return {
      Text: "Connections",
      href: PagesLinks.getConnectionLink(),
      icon: IoIosPeople,
    };
  },
};
