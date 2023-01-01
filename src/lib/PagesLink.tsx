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
  getPublicProfileLink: (userId: string | string[] | undefined) => {
    if (!userId) return PagesLinks.NOT_FOUND_LINK;
    return `/profile/${Array.isArray(userId) ? userId[0] : userId}/public`;
  },
  getPublicProfileLinkFromRouter: (router: NextRouter) => {
    const userId = router.query.userId;
    if (!userId) return PagesLinks.NOT_FOUND_LINK;
    return `/profile/${
      Array.isArray(userId) ? userId[0] || PagesLinks.NOT_FOUND_LINK : userId
    }/public`;
  },
  ME: `/me`,
  NOT_FOUND_LINK: "/404",
  getBannedLink: (router?: NextRouter) => {
    if (!router) return `/banned`;
    return `/banned?${callbackUrl}=${router.route}`;
  },
  getQuestionLink: (id?: string) => `/question${id && `/${id}`}`,
  getBlogLink: (id?: string) => `/blog${id && `/${id}`}`,
  getStoryLink: (id?: string) => `/story${id && `/${id}`}`,
  getCommentLink: (id?: string) => `/comment${id && `/${id}`}`,
  getAnswerLink: (id?: string) => `/answer${id && `/${id}`}`,
  getReplyLink: (id?: string) => `/reply${id && `/${id}`}`,
  getScheduledOfDeletionLink: () => "/scheduledOfDeletion",
  getRegisterLink: () => "/register",
  getDeativatedLink: () => "/deactivated",
};

export default PagesLinks;
