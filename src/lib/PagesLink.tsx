import { type NextRouter } from "next/router";
import { callbackUrl } from "./common/names";

const PagesLinks = {
  getLoginLink: (router?: NextRouter) => {
    if (!router) return `/login`;
    return `/login?${callbackUrl}=${router.route}`;
  },
  getProfileLink: (userId: string) => {
    return `/profile/${userId}`;
  },
  getQuestionLink: (id?: string) => `/question${id ? `/${id}` : ""}`,
  getBlogLink: (id?: string) => `/blog${id ? `/${id}` : ""}`,
  getStoryLink: (id?: string) => `/story${id ? `/${id}` : ""}`,
  getCommentLink: (id?: string) => `/comment${id ? `/${id}` : ""}`,
  getAnswerLink: (id?: string) => `/answer${id ? `/${id}` : ""}`,
  getReplyLink: (id?: string) => `/reply${id ? `/${id}` : ""}`,
  getMessageLink: (id?: string) => `/message${id ? `/${id}` : ""}`,
  getPeoplesLink: (id?: string) => `/peoples${id ? `/${id}` : ""}`,
  getMyConnectionsLink: (id?: string) =>
    `/peoples/connections/${id ? `/${id}` : ""}`,
  HOME_Link: "/",
  ME: `/me`,
  NOT_FOUND_LINK: "/404",
  BANNED_LINK: `/banned`,
  EDIT_ACCOUNT_LINK: "/edit/account",
  REGISTER_LINK: "/register",
  DEATIVATED_LINK: "/deactivated",
  NOTIFICATION_LINK: "/notification",
};

export default PagesLinks;
