import { NextRouter } from "next/router";
import { callbackUrl } from "./common/names";

const PagesLinks = {
  HOME_Link: "/",
  getLoginLink: (router?: NextRouter) => {
    if (!router) return `/login`;
    return `/login?${callbackUrl}=${router.route}`;
  },
  getProfileLink: (userId: string) => {
    return `/profile/${userId}`;
  },
  ME: `/me`,
  NOT_FOUND_LINK: "/404",
  getBannedLink: (router?: NextRouter) => {
    if (!router) return `/banned`;
    return `/banned?${callbackUrl}=${router.route}`;
  },
  getQuestionLink: (id?: string) => `/question${id ? `/${id}` : ""}`,
  getBlogLink: (id?: string) => `/blog${id ? `/${id}` : ""}`,
  getStoryLink: (id?: string) => `/story${id ? `/${id}` : ""}`,
  getCommentLink: (id?: string) => `/comment${id ? `/${id}` : ""}`,
  getAnswerLink: (id?: string) => `/answer${id ? `/${id}` : ""}`,
  getReplyLink: (id?: string) => `/reply${id ? `/${id}` : ""}`,
  getMessageLink: (id?: string) => `/message${id ? `/${id}` : ""}`,
  getConnectionLink: (id?: string) => `/connection${id ? `/${id}` : ""}`,
  getScheduledOfDeletionLink: () => "/scheduledOfDeletion",
  getRegisterLink: () => "/register",
  getDeativatedLink: () => "/deactivated",
  getNotificationLink: () => "/notification",
};

export default PagesLinks;
