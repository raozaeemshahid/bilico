import type { NextRouter } from "next/router";
import { callbackUrl } from "./common/names";

const PagesLinks = {
  getLoginLink: (router?: NextRouter) => {
    if (!router) return `/login`;
    return `/login?${callbackUrl}=${router.asPath}`;
  },
  getProfileLink: (userId: string) => {
    return `/profile/${userId}`;
  },
  getCommentLink: (id?: string) => `/comment${id ? `/${id}` : ""}`,
  getReplyLink: (id?: string) => `/reply${id ? `/${id}` : ""}`,
  getMessageLink: (id?: string) => `/message${id ? `/${id}` : ""}`,
  getPeoplesLink: (id?: string) => `/peoples${id ? `/${id}` : ""}`,
  getPostLink: (id: string) => `/post/${id}`,
  HOME_Link: "/",
  ME: `/me`,
  NOT_FOUND_LINK: "/404",
  BANNED_LINK: `/banned`,
  EDIT_ACCOUNT_LINK: "/edit/account",
  REGISTER_LINK: "/register",
  DEACTIVATED_LINK: "/deactivated",
  DEACTIVATED_ME_LINK: "/me/deactivate",
  DELETE_ME_LINK: "/me/delete",
  NOTIFICATION_LINK: "/notification",
  REQUESTS_LINK: "/requests",
};

export default PagesLinks;
