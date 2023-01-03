import { router } from "../../trpc";
import { amIBanned } from "./amIBanned";
import { confirmRegistration } from "./confirmRegistration";
import { info } from "./info";
import { deleteMyAccount } from "./delete";
import { ReactivateAccount } from "./reactivate";
import { DeactivateAccount } from "./deativate";

export const me = router({
  amIBanned,
  confirmRegistration,
  info,
  deleteMyAccount,
  ReactivateAccount,
  DeactivateAccount,
});
