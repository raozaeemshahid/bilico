import { createTRPCRouter } from "../../trpc";
import { amIBanned } from "./amIBanned";
import { confirmRegistration } from "./confirmRegistration";
import { info } from "./info";
import { deleteMyAccount } from "./delete";
import { ReactivateAccount } from "./reactivate";
import { DeactivateAccount } from "./deactivate";
import { data } from "./data";
import { updateBio } from "./updateBio";
import { getAllInterestsAndSkills } from "./getAllInterestsAndSkills";
import { editAccount } from "./editAccount";
import { createPost } from "./createPost";
import { getPosts } from "./getPosts";
import { DeletePost } from "./deletePost";

export const me = createTRPCRouter({
  amIBanned,
  confirmRegistration,
  info,
  deleteMyAccount,
  ReactivateAccount,
  DeactivateAccount,
  data,
  updateBio,
  getAllInterestsAndSkills,
  editAccount,
  createPost,
  getPosts,
  DeletePost,
});
