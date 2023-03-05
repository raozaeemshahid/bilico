import { createTRPCRouter } from "../../trpc";
import { getProfile } from "./getProfile";
import {searchPeoples} from './searchPeoples'

export const publicApi = createTRPCRouter({
  getProfile,
  searchPeoples
});
