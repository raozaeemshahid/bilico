import PagesLinks from "./PagesLink";
import { type NextRouter } from "next/router";

import { callbackUrl } from "./common/names";
import moment, { type Moment } from "moment";

export const getCallbackUrlFromRouter = (router: NextRouter) => {
  const query = router.query;
  if (!query[callbackUrl]) return PagesLinks.HOME_Link;
  return Array.isArray(query[callbackUrl])
    ? query[callbackUrl][0] || PagesLinks.HOME_Link
    : query[callbackUrl];
};

export const isAlreadyPast = (date: Moment) => {
  return date.diff(moment(), "day", false) < 0;
};
