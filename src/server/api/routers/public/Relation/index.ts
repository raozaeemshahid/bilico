import { createTRPCRouter } from "../../../trpc";
import { acceptRequest } from "./acceptRequest";
import { block } from "./block";
import { cancelRequest } from "./cancelRequest";
import { follow } from "./follow";
import { rejectRequest } from "./rejectRequest";
import { removeConnection } from "./removeConnection";
import { removeTrust } from "./removeTrust";
import { sendRequest } from "./sendRequest";
import { trust } from "./trust";
import { unblock } from "./unblock";
import { unfollow } from "./unfollow";

const Relation = createTRPCRouter({
  acceptRequest,
  block,
  unblock,
  follow,
  removeConnection,
  removeTrust,
  sendRequest,
  trust,
  unfollow,
  cancelRequest,
  rejectRequest,
});

export default Relation;
