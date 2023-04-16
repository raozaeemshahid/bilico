import { createTRPCRouter } from "../../trpc";
import { amIBanned } from "./amIBanned";
import { confirmRegistration } from "./confirmRegistration";
import { info } from "./info";
import { deleteMyAccount } from "./delete";
import { reactivateAccount } from "./reactivate";
import { deactivateAccount } from "./deactivate";
import { data } from "./data";
import { updateBio } from "./updateBio";
import { getAllInterestsAndSkills } from "./getAllInterestsAndSkills";
import { editAccount } from "./editAccount";
import { createPost } from "./createPost";
import { getPosts } from "./getPosts";
import { deletePost } from "./deletePost";
import { getConnectionRequests } from "./getConnectionRequests";

export const me = createTRPCRouter({
  amIBanned,
  confirmRegistration,
  info,
  deleteMyAccount,
  reactivateAccount,
  deactivateAccount,
  data,
  updateBio,
  getAllInterestsAndSkills,
  editAccount,
  createPost,
  getPosts,
  deletePost,
  getConnectionRequests,
});
