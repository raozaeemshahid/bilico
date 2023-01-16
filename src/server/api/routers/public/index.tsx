import { createTRPCRouter } from "../../trpc";
import { getProfile } from "./getProfile";

export const publicApi = createTRPCRouter({
  getProfile,
});
