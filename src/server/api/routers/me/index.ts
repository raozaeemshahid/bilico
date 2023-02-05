import { createTRPCRouter } from "../../trpc";
import { amIBanned } from "./amIBanned";
import { confirmRegistration } from "./confirmRegistration";
import { info } from "./info";
import { deleteMyAccount } from "./delete";
import { ReactivateAccount } from "./reactivate";
import { DeactivateAccount } from "./deactivate";
import { data } from "./data";
import { updateBio } from "./updateBio";

export const me = createTRPCRouter({
  amIBanned,
  confirmRegistration,
  info,
  deleteMyAccount,
  ReactivateAccount,
  DeactivateAccount,
  data,
  updateBio,
});