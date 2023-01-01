import { router } from "../../trpc";
import { requestToUnban } from "./requestToUnban";

export const reportToAdmin = router({
  requestToUnban,
});
