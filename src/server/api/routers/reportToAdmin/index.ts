import { createTRPCRouter } from "../../trpc";
import { requestToUnban } from "./requestToUnban";

export const reportToAdmin = createTRPCRouter({
  requestToUnban,
});
