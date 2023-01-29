import PagesLinks from "./PagesLink";
import { type IconType } from "react-icons";

import { VscAccount } from "react-icons/vsc";
import { MdForum, MdNotifications } from "react-icons/md";
import { TbWriting, TbMessage } from "react-icons/tb";
import { ImBlog } from "react-icons/im";
import { FaHome } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";

export interface LinkType {
  Text: string;
  href: string;
  icon: IconType;
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
