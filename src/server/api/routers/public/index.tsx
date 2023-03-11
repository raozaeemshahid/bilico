import { createTRPCRouter } from "../../trpc";
import { getProfile } from "./getProfile";
import {searchPeoples} from './searchPeoples'
import { getUserPosts } from "./getUserPosts";
import { reactPost } from "./reactPost";

export const publicApi = createTRPCRouter({
  getProfile,
  searchPeoples,
  getUserPosts,
  reactPost
});

