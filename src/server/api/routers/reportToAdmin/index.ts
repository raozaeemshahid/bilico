import { createTRPCRouter } from "../../trpc";
import { requestToUnban } from "./requestToUnban";
import { reportPost } from "./reportPost";

export const reportToAdmin = createTRPCRouter({
  requestToUnban,
  reportPost,
});
