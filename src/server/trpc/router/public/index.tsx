import { router } from "../../trpc";
import { getProfile } from "./getProfile";

export const publicApi = router({
  getProfile,
});
