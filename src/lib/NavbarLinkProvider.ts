import { Session } from "next-auth";
import { Link } from "../components/Navbar";
import PagesLinks from "./PagesLink";

const NavbarLinkText = {
  HOME: "Home",
  USER_NAME: (session: Session) => {
    if (session.user && session.user.name) {
      const Name = session.user.name.split(" ");
      return Name[0] + (Name[1] ? " " + Name[1] : "");
    } else return "Profile";
  },
  QUESTIONS: "Questions",
  STORIES: "Stories",
  BLOGS: "Blogs",
};

export const NavbarLinkCreator = {
  profileLink: (session: Session): Link => {
    return {
      Text: NavbarLinkText.USER_NAME(session),
      href: PagesLinks.ME,
    };
  },
  questionLink: (): Link => {
    return {
      Text: NavbarLinkText.QUESTIONS,
      href: PagesLinks.getQuestionLink(),
    };
  },
  storyLink: (): Link => {
    return {
      Text: NavbarLinkText.STORIES,
      href: PagesLinks.getStoryLink(),
    };
  },
  BlogLink: (): Link => {
    return {
      Text: NavbarLinkText.BLOGS,
      href: PagesLinks.getBlogLink(),
    };
  },
  HomeLink: (): Link => {
    return {
      Text: NavbarLinkText.HOME,
      href: PagesLinks.HOME_Link,
    };
  },
};
